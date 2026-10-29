import { FC, ReactElement, useState } from "react";
import { Matcher } from "react-day-picker";
import { enGB, ms } from "date-fns/locale";
import { format } from "date-fns";
import { useControllableState, useMediaQuery } from "../../hooks";
import { clx } from "../../utils";
import { CalendarIcon } from "../../icons/calendar";
import { Button, button_cva, ButtonIcon } from "../core/button";
import { Calendar } from "./calendar";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogTrigger,
} from "../core/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../core/popover";
import { VariantProps } from "class-variance-authority";

type DatePickerProps = {
  defaultValue?: Date;
  disabled?: Matcher | Matcher[];
  formatStr?: string;
  icon?: ReactElement;
  locale?: "en" | "ms";
  maxYear?: number;
  minYear?: number;
  placeholder?: string;
  value?: Date;
  onValueChange?: (date: Date) => void;
  size?: VariantProps<typeof button_cva>["size"];
  yearOrder?: "asc" | "desc";
  /** On the trigger button: point a `FieldLabel`'s `htmlFor` (or an `ErrorSummary` error) at it. */
  id?: string;
  /** Submits the date as `yyyy-mm-dd` under this name in a native form post. */
  name?: string;
  /** Shows the error style on the trigger. */
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

/**
 * DatePicker opens a calendar from a button: a popover on wide screens and a
 * dialog on narrow ones (below 1024px). Choosing a day closes it.
 *
 * It is a button, not an input, so it doesn't register with `Field` or
 * `Form`: label it with `FieldLabel htmlFor={id}` and keep the value in state
 * (`value` and `onValueChange`). With `name`, a native form post also submits
 * it as `yyyy-mm-dd`. Use `DateField` when people type a date they know.
 */
const DatePicker: FC<DatePickerProps> = ({
  defaultValue,
  disabled,
  formatStr = "dd MMM yyy",
  icon,
  locale = "en",
  onValueChange,
  placeholder = "dd / mm / yyyy",
  value,
  size,
  id,
  name,
  invalid,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
  ...props
}) => {
  const [date, setDate] = useControllableState({
    prop: value,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });
  const [open, setOpen] = useState(false);
  const desktop = useMediaQuery("(min-width: 1024px)");

  const _locale = locale === "en" ? enGB : ms;
  const formatDate = (date: Date) =>
    format(date, formatStr, {
      locale: _locale,
    });

  const select = (day: Date) => {
    setDate(day);
    setOpen(false);
  };

  // One trigger at a time, so `id` is unique and focus lands on a visible button
  const trigger = (
    <Button
      variant="default-outline"
      size={size}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-invalid={invalid || undefined}
      className={clx(invalid && "ring-fr-danger ring", className)}
    />
  );
  const triggerContent = (
    <>
      <ButtonIcon>{icon ?? <CalendarIcon />}</ButtonIcon>
      {date ? formatDate(date) : placeholder}
    </>
  );
  const calendar = (
    <Calendar
      disabled={disabled}
      locale={_locale}
      mode="single"
      month={date}
      onSelect={select}
      required
      selected={date}
      {...props}
    />
  );

  return (
    <>
      {desktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger disabled={disabled === true} render={trigger}>
            {triggerContent}
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0" align="start">
            {calendar}
          </PopoverContent>
        </Popover>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger disabled={disabled === true} render={trigger}>
            {triggerContent}
          </DialogTrigger>
          <DialogBody className="sm:w-fit">
            <DialogContent className="p-0">{calendar}</DialogContent>
          </DialogBody>
        </Dialog>
      )}
      {name && (
        <input
          type="hidden"
          name={name}
          value={date ? format(date, "yyyy-MM-dd") : ""}
        />
      )}
    </>
  );
};
DatePicker.displayName = "DatePicker";

export { DatePicker };
export type { DatePickerProps };
