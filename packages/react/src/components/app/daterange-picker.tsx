import { FC } from "react";
import { DateAfter, DateBefore, DateRange, Matcher } from "react-day-picker";
import { enGB, ms } from "date-fns/locale";
import { format } from "date-fns";
import { useControllableState } from "../../hooks";
import { Button, button_cva } from "../core/button";
import { Calendar } from "./calendar";
import { Dialog, DialogBody, DialogContent, DialogTrigger } from "../core/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../core/popover";
import { VariantProps } from "class-variance-authority";

export type DateRangePickerProps = {
  defaultValue?: DateRange;
  disabled?: Matcher | Matcher[];
  excludeDisabled?: boolean;
  formatStr?: string;
  fromLabel?: string;
  locale?: "en" | "ms";
  maxYear?: number;
  minYear?: number;
  onValueChange?: (date: DateRange) => void;
  placeholder?: string;
  value?: DateRange;
  size?: VariantProps<typeof button_cva>["size"];
  toLabel?: string;
  yearOrder?: "asc" | "desc";
};

/**
 * The DateRangePicker component allows users to select a range of dates from an interactive calendar.
 * @see {@link https://design.digital.gov.my/?path=/docs/myds-react-daterangepicker--docs}
 */
const DateRangePicker: FC<DateRangePickerProps> = ({
  defaultValue,
  disabled,
  formatStr = "dd MMM yyy",
  fromLabel,
  locale = "en",
  onValueChange,
  placeholder = "dd / mm / yyyy",
  value,
  size,
  toLabel,
  ...props
}) => {
  const [selectedDateRange, setSelectedDateRange] = useControllableState({
    prop: value,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });

  const isMS = locale === "ms";
  const _locale = isMS ? ms : enGB;
  const formatDate = (date: Date) =>
    format(date, formatStr, {
      locale: _locale,
    });

  const dateBefore: DateBefore = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    before: selectedDateRange?.from!,
  };
  const dateAfter: DateAfter = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    after: selectedDateRange?.to!,
  };

  return (
    <>
      {/* Mobile */}
      <div className="text-txt-black-900 flex items-center gap-1.5 lg:hidden">
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="default-outline"
                size={size}
                className="whitespace-nowrap"
              />
            }
          >
            <span className="text-txt-black-500">
              {fromLabel ? fromLabel : isMS ? "Dari:" : "From:"}
            </span>
            {selectedDateRange?.from
              ? formatDate(selectedDateRange.from)
              : placeholder}
          </DialogTrigger>
          <DialogBody className="w-fit min-w-fit" hideClose>
            <DialogContent className="w-[304px] p-0">
              <Calendar
                disabled={
                  selectedDateRange?.to
                    ? disabled
                      ? Array.isArray(disabled)
                        ? [...disabled, dateAfter]
                        : [disabled, dateAfter]
                      : dateAfter
                    : disabled
                }
                locale={_locale}
                mode="range"
                month={selectedDateRange?.from}
                onSelect={({ from, to }) => {
                  const date = from === selectedDateRange?.from ? to : from;
                  setSelectedDateRange({ ...selectedDateRange, from: date });
                }}
                required
                selected={selectedDateRange}
                daterange="from"
                {...props}
              />
            </DialogContent>
          </DialogBody>
        </Dialog>
        -
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="default-outline"
                size={size}
                className="whitespace-nowrap"
              />
            }
          >
            <span className="text-txt-black-500">
              {toLabel ? toLabel : isMS ? "Hingga:" : "To:"}
            </span>
            {selectedDateRange?.to
              ? formatDate(selectedDateRange.to)
              : placeholder}
          </DialogTrigger>
          <DialogBody className="w-fit min-w-fit" hideClose>
            <DialogContent className="w-[304px] p-0">
              <Calendar
                disabled={
                  selectedDateRange?.from
                    ? disabled
                      ? Array.isArray(disabled)
                        ? [...disabled, dateBefore]
                        : [disabled, dateBefore]
                      : dateBefore
                    : disabled
                }
                locale={_locale}
                mode="range"
                month={selectedDateRange?.to}
                onSelect={setSelectedDateRange}
                required
                selected={selectedDateRange}
                daterange="to"
                {...props}
              />
            </DialogContent>
          </DialogBody>
        </Dialog>
      </div>

      {/* Desktop */}
      <div className="text-txt-black-900 hidden items-center gap-1.5 lg:flex">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="default-outline"
                size={size}
                className="whitespace-nowrap"
              />
            }
          >
            <span className="text-txt-black-500">
              {fromLabel ? fromLabel : isMS ? "Dari:" : "From:"}
            </span>
            {selectedDateRange?.from
              ? formatDate(selectedDateRange.from)
              : placeholder}
          </PopoverTrigger>
          <PopoverContent className="w-[304px] p-0" align="start">
            <Calendar
              disabled={
                selectedDateRange?.to
                  ? disabled
                    ? Array.isArray(disabled)
                      ? [...disabled, dateAfter]
                      : [disabled, dateAfter]
                    : dateAfter
                  : disabled
              }
              locale={_locale}
              mode="range"
              month={selectedDateRange?.from}
              onSelect={({ from, to }) => {
                const date = from === selectedDateRange?.from ? to : from;
                setSelectedDateRange({ ...selectedDateRange, from: date });
              }}
              required
              selected={selectedDateRange}
              daterange="from"
              {...props}
            />
          </PopoverContent>
        </Popover>
        -
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="default-outline"
                size={size}
                className="whitespace-nowrap"
              />
            }
          >
            <span className="text-txt-black-500">
              {toLabel ? toLabel : isMS ? "Hingga:" : "To:"}
            </span>
            {selectedDateRange?.to
              ? formatDate(selectedDateRange.to)
              : placeholder}
          </PopoverTrigger>
          <PopoverContent className="w-[304px] p-0" align="end">
            <Calendar
              disabled={
                selectedDateRange?.from
                  ? disabled
                    ? Array.isArray(disabled)
                      ? [...disabled, dateBefore]
                      : [disabled, dateBefore]
                    : dateBefore
                  : disabled
              }
              locale={_locale}
              mode="range"
              month={selectedDateRange?.to}
              onSelect={setSelectedDateRange}
              required
              selected={selectedDateRange}
              daterange="to"
              {...props}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };

export type { DateRange };
