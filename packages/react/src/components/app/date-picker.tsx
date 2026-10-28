import { FC, ReactElement } from "react";
import { Matcher } from "react-day-picker";
import { enGB, ms } from "date-fns/locale";
import { format } from "date-fns";
import { useControllableState } from "../../hooks";
import { CalendarIcon } from "../../icons/calendar";
import { Button, button_cva, ButtonIcon } from "../core/button";
import { Calendar } from "./calendar";
import { Dialog, DialogBody, DialogContent, DialogTrigger } from "../core/dialog";
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
};

/**
 * The DatePicker component allows users to select a date from an interactive calendar.
 * @see {@link https://design.digital.gov.my/?path=/docs/myds-react-datepicker--docs}
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
  ...props
}) => {
  const [date, setDate] = useControllableState({
    prop: value,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });

  const _locale = locale === "en" ? enGB : ms;
  const formatDate = (date: Date) =>
    format(date, formatStr, {
      locale: _locale,
    });

  return (
    <>
      {/* Mobile */}
      <Dialog>
        <DialogTrigger
          disabled={disabled === true}
          render={
            <Button
              variant="default-outline"
              size={size}
              className="flex lg:hidden"
            />
          }
        >
          <ButtonIcon>{icon ?? <CalendarIcon />}</ButtonIcon>
          {date ? formatDate(date) : placeholder}
        </DialogTrigger>
        <DialogBody hideClose className="sm:w-fit">
          <DialogContent className="p-0">
            <Calendar
              disabled={disabled}
              locale={_locale}
              mode="single"
              month={date}
              onSelect={setDate}
              required
              selected={date}
              {...props}
            />
          </DialogContent>
        </DialogBody>
      </Dialog>

      {/* Desktop */}
      <Popover>
        <PopoverTrigger
          disabled={disabled === true}
          render={
            <Button
              variant="default-outline"
              size={size}
              className="hidden lg:flex"
            />
          }
        >
          <ButtonIcon>{icon ?? <CalendarIcon />}</ButtonIcon>
          {date ? formatDate(date) : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-[304px] p-0" align="start">
          <Calendar
            disabled={disabled}
            locale={_locale}
            mode="single"
            month={date}
            onSelect={setDate}
            required
            selected={date}
            {...props}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
DatePicker.displayName = "DatePicker";

export { DatePicker };
