import path from "path";
// TypeScript 7 (the repo's compiler) has no JS API; 6.x is the last release with one.
import ts from "typescript-api";

/**
 * Read the public API of FTDS source files with the TypeScript checker: every
 * export, and for components the props they declare themselves (inherited
 * DOM and Base UI props are summarised, not listed).
 */

const REACT_DIR = path.join(__dirname, "../../packages/react");
const SRC_DIR = path.join(REACT_DIR, "src");

export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export type ExportInfo =
  | {
      kind: "component";
      name: string;
      props: PropInfo[];
      /** Props of the Base UI part it wraps (value, onValueChange, open, ...). */
      baseUiProps: PropInfo[];
      /** Standard React DOM props of the element it renders (className, onClick, aria-*, ...). */
      domPropCount: number;
      description: string;
    }
  | { kind: "function"; name: string; signature: string; description: string }
  | { kind: "type" | "value"; name: string; description: string };

const SKIPPED_PROPS = new Set(["key", "ref"]);
/** Listed once in the summary line instead of under every Base UI part. */
const SKIPPED_BASE_UI_PROPS = new Set(["className", "style"]);
const FORMAT =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

let program: ts.Program | undefined;

function getProgram(): ts.Program {
  if (program) return program;
  const config = ts.getParsedCommandLineOfConfigFile(
    path.join(REACT_DIR, "tsconfig.json"),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        );
      },
    },
  );
  if (!config) throw new Error("Could not read packages/react/tsconfig.json");
  program = ts.createProgram(config.fileNames, {
    ...config.options,
    noEmit: true,
  });
  return program;
}

const clean = (text: string) => text.replace(/\s+/g, " ").trim();

/** `"a" | "b" | null | undefined` -> `"a" | "b"`: optionality is shown separately. */
function stripNullish(type: string): string {
  return type
    .split(" | ")
    .filter((part) => part !== "undefined" && part !== "null")
    .join(" | ");
}

/** Declared in FTDS source, or a cva variant (whose declaration is the variants object in FTDS source). */
function isOwnDeclaration(declaration: ts.Declaration): boolean {
  return declaration.getSourceFile().fileName.startsWith(SRC_DIR);
}

function isBaseUiDeclaration(declaration: ts.Declaration): boolean {
  return declaration.getSourceFile().fileName.includes("/@base-ui/");
}

function documentation(symbol: ts.Symbol, checker: ts.TypeChecker): string {
  return clean(
    ts.displayPartsToString(symbol.getDocumentationComment(checker)),
  );
}

function propInfo(
  prop: ts.Symbol,
  checker: ts.TypeChecker,
  at: ts.Node,
): PropInfo {
  const declaration =
    prop.declarations?.find(isOwnDeclaration) ??
    prop.declarations?.find(isBaseUiDeclaration);
  const typeNode =
    declaration &&
    (ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration))
      ? declaration.type
      : undefined;
  // Prefer the written type (`ReactNode`, `ColumnDef<TData>[]`) over the
  // checker's expansion, except for unions of literals, which the checker
  // spells out in full (cva variants have no written type at all).
  const checked = stripNullish(
    checker.typeToString(
      checker.getTypeOfSymbolAtLocation(prop, at),
      undefined,
      FORMAT,
    ),
  );
  const written = typeNode
    ? stripNullish(clean(typeNode.getText()))
    : undefined;
  const isLiteralUnion =
    /^("[^"]*"|\d+|true|false)( \| ("[^"]*"|\d+|true|false))*$/.test(checked);
  const type =
    written && !(isLiteralUnion && !written.includes('"')) ? written : checked;

  const defaultTag = prop
    .getJsDocTags(checker)
    .find((tag) => tag.name === "default" || tag.name === "defaultValue");

  return {
    name: prop.name,
    type,
    required: !(prop.flags & ts.SymbolFlags.Optional),
    description: documentation(prop, checker),
    defaultValue: defaultTag?.text
      ? clean(ts.displayPartsToString(defaultTag.text))
      : undefined,
  };
}

/**
 * Default values a component gives its props by destructuring, e.g.
 * `forwardRef(({ variant = "primary-fill", size = "small" }, ref) => ...)`.
 */
function destructuredDefaults(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
): Map<string, string> {
  // `size = DEFAULT_SIZE` -> the constant's value, when it is a plain literal
  const valueOf = (expression: ts.Expression): string => {
    if (ts.isIdentifier(expression)) {
      const declaration =
        checker.getSymbolAtLocation(expression)?.valueDeclaration;
      if (
        declaration &&
        ts.isVariableDeclaration(declaration) &&
        declaration.initializer &&
        (ts.isLiteralExpression(declaration.initializer) ||
          declaration.initializer.kind === ts.SyntaxKind.TrueKeyword ||
          declaration.initializer.kind === ts.SyntaxKind.FalseKeyword)
      ) {
        return clean(declaration.initializer.getText());
      }
    }
    return clean(expression.getText());
  };
  const defaults = new Map<string, string>();
  const visit = (node: ts.Node | undefined): void => {
    if (!node) return;
    if (ts.isVariableDeclaration(node)) return visit(node.initializer);
    if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node))
      return visit(node.expression);
    if (ts.isCallExpression(node)) return node.arguments.forEach(visit); // forwardRef(...), memo(...)
    if (
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node) ||
      ts.isFunctionDeclaration(node)
    ) {
      const binding = node.parameters[0]?.name;
      if (binding && ts.isObjectBindingPattern(binding)) {
        for (const element of binding.elements) {
          const key = element.propertyName ?? element.name;
          if (element.initializer && ts.isIdentifier(key)) {
            defaults.set(key.text, valueOf(element.initializer));
          }
        }
      }
    }
  };
  symbol.declarations?.forEach(visit);
  return defaults;
}

/** The first call signature's props parameter, if this value is a React component. */
function componentProps(
  type: ts.Type,
  checker: ts.TypeChecker,
  at: ts.Node,
): ts.Type | undefined {
  const signature = type.getCallSignatures()[0];
  const param = signature?.parameters[0];
  if (!signature || !param) return undefined;
  const props = checker.getTypeOfSymbolAtLocation(param, at);
  return props.flags & ts.TypeFlags.Object ||
    props.isIntersection() ||
    props.isUnion()
    ? props
    : undefined;
}

/** Public API of one source file, in export order. */
export function readExports(filePath: string): ExportInfo[] {
  const prog = getProgram();
  const checker = prog.getTypeChecker();
  const source = prog.getSourceFile(filePath);
  if (!source)
    throw new Error(`Not in the packages/react program: ${filePath}`);
  const moduleSymbol = checker.getSymbolAtLocation(source);
  if (!moduleSymbol) return [];

  return checker
    .getExportsOfModule(moduleSymbol)
    .flatMap((exported): ExportInfo[] => {
      const symbol =
        exported.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(exported)
          : exported;
      const name = exported.name;
      if (name === "default") return [];
      const description = documentation(symbol, checker);

      if (!(symbol.flags & ts.SymbolFlags.Value)) {
        return [{ kind: "type", name, description }];
      }

      const type = checker.getTypeOfSymbolAtLocation(symbol, source);
      if (/^[A-Z]/.test(name)) {
        const props = componentProps(type, checker, source);
        if (props) {
          const all = checker
            .getPropertiesOfType(props)
            .filter((p) => !SKIPPED_PROPS.has(p.name));
          const own = all.filter((p) => p.declarations?.some(isOwnDeclaration));
          const baseUi = all.filter(
            (p) =>
              !own.includes(p) &&
              !SKIPPED_BASE_UI_PROPS.has(p.name) &&
              p.declarations?.some(isBaseUiDeclaration),
          );
          const defaults = destructuredDefaults(symbol, checker);
          const toInfo = (list: ts.Symbol[]) =>
            list
              .map((p) => {
                const info = propInfo(p, checker, source);
                info.defaultValue ??= defaults.get(p.name);
                return info;
              })
              .sort((a, b) => Number(b.required) - Number(a.required));
          return [
            {
              kind: "component",
              name,
              props: toInfo(own),
              baseUiProps: toInfo(baseUi),
              domPropCount: all.length - own.length - baseUi.length,
              description,
            },
          ];
        }
      }

      const signature = type.getCallSignatures()[0];
      // cva class builders (button_cva) are styling helpers, not API to call by hand
      if (signature && !/_(cva|class)$/.test(name)) {
        return [
          {
            kind: "function",
            name,
            signature: clean(
              checker.signatureToString(signature, undefined, FORMAT),
            ),
            description,
          },
        ];
      }
      return [{ kind: "value", name, description }];
    });
}

export const REACT_SRC_DIR = SRC_DIR;
