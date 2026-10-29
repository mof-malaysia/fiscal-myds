// registry:block — composed page section, installs to components/blocks
import React, {
  ComponentProps,
  FormEvent,
  MouseEvent,
  ReactNode,
  forwardRef,
  useId,
} from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { clx } from "@/lib/ftds/utils";

/**
 * SettingsLayout is the frame of an account or settings area: a list of
 * sections beside the content on wide screens, and a row of section links that
 * scrolls sideways on narrow ones. The current section is marked with the Blue
 * Wash and `aria-current="page"`.
 *
 * Fill it with `SettingsSection`s. A section with `onSave` is a form with a
 * Save button and a "Changes saved" confirmation; `SettingsRow` puts a label
 * and description beside a control such as a Switch.
 *
 * @example
 * <SettingsLayout
 *   title="Account settings"
 *   items={[
 *     { id: "profile", label: "Profile", href: "/account/profile" },
 *     { id: "security", label: "Security", href: "/account/security" },
 *   ]}
 *   current="profile"
 * >
 *   <SettingsSection title="Personal details" onSave={save} saved={saved}>
 *     <Field>…</Field>
 *   </SettingsSection>
 * </SettingsLayout>
 */

interface SettingsNavItem {
  id: string;
  label: string;
  href?: string;
  /** Decorative icon shown before the label on wide screens. */
  icon?: ReactNode;
}

interface SettingsLayoutLabels {
  /** Accessible name of the section navigation. */
  nav: string;
}

const DEFAULT_LAYOUT_LABELS: SettingsLayoutLabels = {
  nav: "Settings sections",
};

interface SettingsLayoutProps extends Omit<ComponentProps<"div">, "title"> {
  /** The page heading, rendered as the h1. */
  title?: ReactNode;
  description?: ReactNode;
  items: SettingsNavItem[];
  /** `id` of the current section. */
  current?: string;
  /**
   * Called when a section link is chosen. Call `event.preventDefault()` to
   * handle navigation yourself (client-side routing).
   */
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  labels?: Partial<SettingsLayoutLabels>;
}

const SettingsLayout = forwardRef<HTMLDivElement, SettingsLayoutProps>(
  (
    {
      title,
      description,
      items,
      current,
      onNavigate,
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LAYOUT_LABELS, ...labelsProp };
    return (
      <div
        ref={ref}
        className={clx("font-body text-txt-black-900 w-full", className)}
        {...props}
      >
        {(title || description) && (
          <header className="mb-stack-lg">
            {title && (
              <h1 className="text-headline text-txt-black-900 font-semibold">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-content text-txt-black-700 mt-2 max-w-prose">
                {description}
              </p>
            )}
          </header>
        )}
        <div className="gap-stack-lg flex flex-col md:flex-row md:items-start">
          <nav
            aria-label={labels.nav}
            className={clx(
              // Narrow: a row of links that scrolls sideways to the screen edge, without a scrollbar
              "-mx-surface px-surface overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "md:sticky md:top-4 md:mx-0 md:w-56 md:shrink-0 md:overflow-visible md:px-0",
            )}
          >
            <ul className="m-0 flex w-max list-none gap-1 p-0 md:w-auto md:flex-col">
              {items.map((item) => {
                const active = item.id === current;
                return (
                  <li key={item.id} className="shrink-0">
                    <a
                      href={item.href ?? `#${item.id}`}
                      aria-current={active ? "page" : undefined}
                      onClick={(event) => onNavigate?.(item.id, event)}
                      className={clx(
                        "flex h-[var(--ctl-h-sm)] items-center gap-3 rounded-md px-3 whitespace-nowrap no-underline",
                        "text-label-md text-txt-black-700 font-medium outline-none",
                        "hover:bg-bg-washed hover:text-txt-black-900 focus-ring transition-colors duration-150 motion-reduce:transition-none",
                        "aria-[current=page]:bg-bg-primary-50 aria-[current=page]:text-txt-primary",
                        "[&>svg]:hidden [&>svg]:size-5 [&>svg]:shrink-0 in-data-[density=compact]:[&>svg]:size-4 md:[&>svg]:block",
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="gap-stack-lg flex min-w-0 flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>
    );
  },
);
SettingsLayout.displayName = "SettingsLayout";

/*========================================================================================================================*/

interface SettingsSectionLabels {
  save: string;
  saving: string;
  cancel: string;
  saved: string;
}

const DEFAULT_SECTION_LABELS: SettingsSectionLabels = {
  save: "Save changes",
  saving: "Saving…",
  cancel: "Cancel",
  saved: "Changes saved",
};

interface SettingsSectionProps
  extends Omit<ComponentProps<"section">, "title" | "onSubmit"> {
  title: ReactNode;
  description?: ReactNode;
  /** Makes the section a form with a Save button; called on submit with the form's data. */
  onSave?: (data: FormData, event: FormEvent<HTMLFormElement>) => void;
  /** Shows a Cancel button beside Save. */
  onCancel?: () => void;
  /** Saving is in progress: the Save button is disabled and says so. */
  pending?: boolean;
  /** Shows the "Changes saved" confirmation. Clear it when the form changes again. */
  saved?: boolean;
  /** A message shown when saving failed. */
  error?: ReactNode;
  /** Replaces the default Save/Cancel footer. */
  footer?: ReactNode;
  labels?: Partial<SettingsSectionLabels>;
}

/**
 * One group of settings on a Well card: a title, a description and the
 * fields. With `onSave` it is a `<form>` that submits on Enter.
 */
const SettingsSection = forwardRef<HTMLElement, SettingsSectionProps>(
  (
    {
      title,
      description,
      onSave,
      onCancel,
      pending = false,
      saved = false,
      error,
      footer,
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_SECTION_LABELS, ...labelsProp };
    const titleId = useId();

    const body = <div className="gap-stack-md flex flex-col">{children}</div>;

    const actions =
      footer ??
      (onSave && (
        <div className="mt-stack-lg gap-stack-sm flex flex-wrap items-center">
          {/* A wash, not a fill: a settings page has a Save per section (DESIGN.md, One Blue Rule) */}
          <Button type="submit" variant="primary-outline" disabled={pending}>
            {pending ? labels.saving : labels.save}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="default-ghost"
              onClick={onCancel}
              disabled={pending}
            >
              {labels.cancel}
            </Button>
          )}
          <p
            role="status"
            className="text-content m-0 flex items-center gap-1.5"
          >
            {error ? (
              <span className="text-txt-danger flex items-center gap-1.5">
                <WarningCircleIcon aria-hidden className="size-4 shrink-0" />
                {error}
              </span>
            ) : (
              saved &&
              !pending && (
                <span className="text-txt-success flex items-center gap-1.5">
                  <CheckCircleIcon aria-hidden className="size-4 shrink-0" />
                  {labels.saved}
                </span>
              )
            )}
          </p>
        </div>
      ));

    return (
      <section
        ref={ref}
        aria-labelledby={titleId}
        className={clx(
          // A Well card: no border, no shadow (DESIGN.md: Cards)
          "bg-bg-washed p-surface rounded-lg",
          className,
        )}
        {...props}
      >
        <div className="mb-stack-md">
          <h2
            id={titleId}
            className="text-title text-txt-black-900 font-semibold"
          >
            {title}
          </h2>
          {description && (
            <p className="text-content text-txt-black-700 mt-1 max-w-prose">
              {description}
            </p>
          )}
        </div>
        {onSave ? (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              onSave(new FormData(event.currentTarget), event);
            }}
          >
            {body}
            {actions}
          </form>
        ) : (
          <>
            {body}
            {actions}
          </>
        )}
      </section>
    );
  },
);
SettingsSection.displayName = "SettingsSection";

/*========================================================================================================================*/

interface SettingsRowProps extends Omit<ComponentProps<"label">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** The control on the right, such as a Switch. */
  control: ReactNode;
  /**
   * `label` (the default) makes the whole row toggle a Switch or Checkbox.
   * Use `div` when the control is a button, link or Select.
   */
  as?: "label" | "div";
}

/**
 * A setting on one line: title and description on the left, the control on the
 * right. Rows in a section are separated by Hairlines.
 */
const SettingsRow = forwardRef<HTMLLabelElement, SettingsRowProps>(
  ({ title, description, control, as = "label", className, ...props }, ref) => {
    const rowClass = clx(
      // Wraps the control under the text when both don't fit
      "border-otl-gray-200 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b py-3 first:pt-0 last:border-b-0 last:pb-0",
      as === "label" && "cursor-pointer",
      className,
    );
    const content = (
      <>
        <span className="flex min-w-48 flex-1 flex-col gap-0.5">
          <span className="text-content text-txt-black-900 font-medium">
            {title}
          </span>
          {description && (
            <span className="text-content text-txt-black-700">
              {description}
            </span>
          )}
        </span>
        <span className="shrink-0">{control}</span>
      </>
    );
    if (as === "div") {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={rowClass}
          {...(props as ComponentProps<"div">)}
        >
          {content}
        </div>
      );
    }
    return (
      <label ref={ref} className={rowClass} {...props}>
        {content}
      </label>
    );
  },
);
SettingsRow.displayName = "SettingsRow";

export { SettingsLayout, SettingsSection, SettingsRow };
export type {
  SettingsLayoutProps,
  SettingsLayoutLabels,
  SettingsNavItem,
  SettingsSectionProps,
  SettingsSectionLabels,
  SettingsRowProps,
};
