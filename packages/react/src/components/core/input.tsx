import React, {
  Children,
  ComponentProps,
  ComponentPropsWithRef,
  ForwardRefExoticComponent,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
} from "react";
import { cva, VariantProps } from "class-variance-authority";
import { clx } from "../../utils";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Input as InputPrimitive } from "@base-ui/react/input";

type InputContextProps = {
  size: "small" | "medium" | "large" | null;
};

const InputContext = createContext<InputContextProps>({
  size: "small",
});

interface InputProps
  extends Omit<InputPrimitive.Props, "size" | "className">,
    VariantProps<typeof input_cva> {
  className?: string;
  prepend?: ReactNode;
  append?: ReactNode;
  children?: ReactNode;
}

const input_cva = cva(
  [
    "bg-bg-white border border-transparent outline-none box-border rounded-md",
    "placeholder:text-txt-black-500 text-txt-black-700 transition-colors w-full",
    "focus-visible:ring focus-visible:ring-fr-primary focus-visible:border-otl-primary-300",
    "disabled:bg-bg-washed disabled:cursor-not-allowed disabled:text-txt-black-disabled",
    "data-[has-prepend=true]:rounded-l-none data-[has-append=true]:rounded-r-none",
    "data-[has-left-icon=true]:pl-10 data-[has-right-icon=true]:pr-10",
  ],
  {
    variants: {
      size: {
        // Height excludes the wrapper's 1px border; follows data-density
        small: "h-[calc(var(--ctl-h-sm)-2px)] px-3 text-field-sm",
        medium: "h-[calc(var(--ctl-h-md)-2px)] px-3 text-field-md",
        large: "h-[calc(var(--ctl-h-lg)-2px)] px-3.5 text-field-lg",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

const Input: ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prepend, append, children, size = "small", ...props }, ref) => {
    const has_icon = useMemo(() => {
      if (!children) return { left: false, right: false };
      const _children = Children.toArray(children);
      return {
        left: _children.some(
          (child) =>
            isValidElement<ComponentPropsWithRef<typeof InputIcon>>(child) &&
            child.props.position === "left",
        ),
        right: _children.some(
          (child) =>
            isValidElement<ComponentPropsWithRef<typeof InputIcon>>(child) &&
            child.props.position === "right",
        ),
      };
    }, [children]);

    return (
      <div
        className={clx(
          "border-otl-control relative rounded-md border outline-none",
          // Inside an invalid Field (DESIGN.md: error stroke turns Danger)
          "has-[input[data-invalid]]:border-danger-600",
          className,
        )}
      >
        <div className="flex w-full flex-row">
          <InputContext.Provider value={{ size }}>
            {prepend}
            <div className="relative w-full">
              {/* Base UI Input joins the surrounding Field: label, hint, error, validity */}
              <InputPrimitive
                ref={ref}
                className={input_cva({ size })}
                data-has-prepend={!!prepend}
                data-has-append={!!append}
                data-has-left-icon={has_icon.left}
                data-has-right-icon={has_icon.right}
                {...props}
              />
              {children}
            </div>
            {append}
          </InputContext.Provider>
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

/*========================================================================================================================*/

const input_addon_cva = cva(
  [
    "flex items-center",
    "border border-transparent outline-none box-border ",
    "[&:not(:last-child)]:border-r-otl-gray-200 [&:not(:first-child)]:border-l-otl-gray-200",
  ],
  {
    variants: {
      size: {
        small: "h-[calc(var(--ctl-h-sm)-2px)] px-3 text-label-sm",
        medium: "h-[calc(var(--ctl-h-md)-2px)] px-3 text-label-md",
        large: "h-[calc(var(--ctl-h-lg)-2px)] px-3.5 text-label-lg",
      },
    },
  },
);

interface InputAddonProps extends useRender.ComponentProps<"div"> {}

const InputAddon: ForwardRefExoticComponent<InputAddonProps> = forwardRef(
  ({ className, render, ...props }, ref) => {
    const { size } = useContext(InputContext);

    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        { className: input_addon_cva({ size, className }) },
        props,
      ),
    });
  },
);

InputAddon.displayName = "InputAddon";

/*========================================================================================================================*/

// Ink Secondary, so icons follow the theme instead of inheriting the page's text colour
const input_icon_cva = cva(
  ["absolute top-0 bottom-0 my-auto text-txt-black-700"],
  {
    variants: {
      size: {
        small: "size-4.5",
        medium: "size-5",
        large: "size-6",
      },
      position: {
        left: "left-3",
        right: "right-3",
      },
    },
    defaultVariants: {
      position: "left",
    },
  },
);

interface InputIconProps extends ComponentProps<"div"> {
  position: "left" | "right";
}

const InputIcon: ForwardRefExoticComponent<InputIconProps> = forwardRef(
  ({ className, position = "left", children, ...props }, ref) => {
    const { size } = useContext(InputContext);
    const childIsElement = isValidElement(children);

    // Merges the icon classes onto its single child element (e.g. an svg icon).
    return useRender({
      defaultTagName: "div",
      render: childIsElement ? children : undefined,
      ref,
      props: mergeProps<"div">(
        { className: input_icon_cva({ position, size, className }) },
        childIsElement ? props : { ...props, children },
      ),
    });
  },
);

InputIcon.displayName = "InputIcon";

/*========================================================================================================================*/

export { Input, InputAddon, InputIcon };
