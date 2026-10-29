import {
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useRef,
} from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { useMergedRefs } from "../../hooks/use-merged-refs";
import { CalendarIcon } from "../../icons/calendar";
import { cva, VariantProps } from "class-variance-authority";

const datefield_container_cva = cva(
  [
    "flex items-center gap-2 border rounded-md text-txt-black-900 focus:outline-none font-body font-normal",
    "focus-within:border-otl-primary-300 focus-within:ring focus-within:ring-fr-primary",
    // Disabled through the Field, too
    "has-[input:disabled]:bg-bg-washed has-[input:disabled]:text-txt-black-500 has-[input:disabled]:cursor-not-allowed",
    // Inside an invalid Field (DESIGN.md: error stroke turns Danger)
    "has-[input[data-invalid]]:border-otl-danger-300 has-[input[data-invalid]]:ring has-[input[data-invalid]]:ring-fr-danger",
  ],
  {
    variants: {
      size: {
        small: "control-sm text-field-sm",
        medium: "control-md text-field-md",
        large: "control-lg text-field-lg",
      },
      disabled: {
        true: "bg-bg-washed text-txt-black-500 cursor-not-allowed",
        false: "bg-bg-white",
      },
      invalid: {
        true: "border-otl-danger-300 ring-fr-danger ring",
        false: "border-otl-control",
      },
    },
    defaultVariants: {
      size: "small",
      disabled: false,
      invalid: false,
    },
  },
);

const datefield_cva = cva([
  "min-w-0 flex-1 bg-transparent focus:outline-none",
  "disabled:bg-bg-washed disabled:text-txt-black-500 disabled:cursor-not-allowed",
  "[&::-webkit-calendar-picker-indicator]:hidden",
  "[&::-webkit-datetime-edit]:max-w-fit",
  "[&::-webkit-datetime-edit-text]:mx-[2px]",
  "[&::-webkit-datetime-edit-day-field:focus]:bg-bg-primary-600 [&::-webkit-datetime-edit-day-field:focus]:text-txt-white",
  "[&::-webkit-datetime-edit-month-field:focus]:bg-bg-primary-600 [&::-webkit-datetime-edit-month-field:focus]:text-txt-white ",
  "[&::-webkit-datetime-edit-year-field:focus]:bg-bg-primary-600 [&::-webkit-datetime-edit-year-field:focus]:text-txt-white",
]);

const icon_cva = cva([], {
  variants: {
    size: {
      small: "size-4",
      medium: "size-4.5",
      large: "size-5",
    },
    disabled: {
      true: "text-txt-black-500",
      false: "text-txt-black-700",
    },
  },
  defaultVariants: {
    size: "small",
    disabled: false,
  },
});

type DateFieldProps = Omit<
  InputPrimitive.Props,
  "type" | "size" | "className"
> &
  VariantProps<typeof datefield_container_cva> & { className?: string };

/**
 * DateField is a native date input (`yyyy-mm-dd` value) styled as an FTDS
 * control. Like `Input`, it joins the `Field` it sits in: the label, hint,
 * error and validity, and `Form` collects its value under the field's `name`.
 *
 * `invalid` forces the error style outside a Field; inside one, set `invalid`
 * on the `Field` instead.
 */
const DateField: ForwardRefExoticComponent<
  DateFieldProps & RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ className, size, disabled, invalid, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);

    // The icon opens the browser's date picker, like clicking the field
    const openPicker = () => {
      const input = inputRef.current;
      if (!input || input.disabled) return;
      input.focus();
      try {
        input.showPicker?.();
      } catch {
        // showPicker throws outside a user gesture in some browsers
      }
    };

    return (
      <div
        className={datefield_container_cva({
          size,
          disabled: Boolean(disabled),
          invalid: Boolean(invalid),
          className,
        })}
      >
        <CalendarIcon
          className={icon_cva({ size, disabled: Boolean(disabled) })}
          aria-hidden
          onClick={openPicker}
        />
        {/* Base UI Input joins the surrounding Field: label, hint, error, validity */}
        <InputPrimitive
          ref={mergedRef}
          type="date"
          className={datefield_cva()}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          {...props}
        />
      </div>
    );
  },
);
DateField.displayName = "DateField";

export { DateField };
export type { DateFieldProps };
