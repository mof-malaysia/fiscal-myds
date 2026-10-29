import {
  addMonths,
  addYears,
  format,
  FormatOptions,
  isDate,
  isSameMonth,
  isSameYear,
  Locale,
  subMonths,
  subYears,
} from "date-fns";
import { FC, useEffect, useRef, useState } from "react";
import {
  DateLib,
  DateRange,
  DayPicker,
  DayPickerProps,
  defaultDateLib,
  isDateAfterType,
  isDateBeforeType,
  isDateInterval,
  isDateRange,
  isDatesArray,
  isDayOfWeekType,
  Matcher,
  rangeIncludesDate,
} from "react-day-picker";
import { ChevronLeftIcon } from "../../icons/chevron-left";
import { ChevronRightIcon } from "../../icons/chevron-right";
import { clx } from "../../utils";
import { Button } from "../core/button";

type CalendarProps = DayPickerProps & {
  maxYear?: number;
  minYear?: number;
  yearOrder?: "asc" | "desc";
  daterange?: "from" | "to";
  /** Accessible name of the month grid's next-year button. Defaults to English, or Bahasa Melayu with a `ms` locale. */
  nextYearLabel?: string;
  /** Accessible name of the month grid's previous-year button. */
  previousYearLabel?: string;
};

/**
 * The same day in another month or year, clamped to that month's length, so the 31st
 * becomes 28 or 29 Feb instead of rolling over into March.
 */
const dateIn = (year: number, monthIndex: number, day: number) =>
  new Date(
    year,
    monthIndex,
    Math.min(day, new Date(year, monthIndex + 1, 0).getDate()),
  );

/** Month navigation: quiet Well squares sized to the calendar, not to the density's controls. */
const calendar_nav_button = clx(
  "bg-bg-washed text-txt-black-900 hover:bg-bg-washed-active inline-flex size-8 cursor-pointer items-center justify-center rounded-md",
  "transition-colors duration-150 motion-reduce:transition-none focus-ring",
  "disabled:bg-bg-white-disabled disabled:text-txt-black-disabled disabled:cursor-not-allowed",
);

/** DayPicker's navigation chevrons, drawn with the FTDS icons. */
const CalendarChevron = ({
  orientation,
  className,
}: {
  orientation?: "up" | "down" | "left" | "right";
  className?: string;
}) => {
  const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return <Icon className={className} />;
};

/** One day cell: 40px comfortable, 32px compact. Set on the calendar's root. */
const calendar_cell_size =
  "[--cal-cell:2.5rem] in-data-[density=compact]:[--cal-cell:2rem]";

/** A range's first and last day: FTDS Blue on the Blue Wash band. */
const range_cap =
  "bg-bg-primary-50 *:bg-bg-primary-600 *:text-txt-white *:hover:bg-bg-primary-600 *:hover:text-txt-white *:focus:bg-bg-primary-600 *:focus:text-txt-white";

/** Day-grid styles shared by Calendar and the range picker's two-month calendar. */
const calendar_day_classnames = {
  button_previous: calendar_nav_button,
  button_next: calendar_nav_button,
  chevron: "size-4",
  month_grid: "w-full border-collapse space-y-1",
  weekdays: "",
  weekday:
    "text-txt-black-700 text-label-compact w-(--cal-cell) py-2 font-normal",
  week: "w-full mt-1.5",
  day: "aspect-square p-0",
  day_button: clx(
    "text-txt-black-900 text-label-sm inline-flex size-(--cal-cell) cursor-pointer items-center justify-center rounded-md",
    "hover:bg-bg-washed transition-colors duration-150 motion-reduce:transition-none focus-ring",
    "disabled:text-txt-black-disabled disabled:cursor-not-allowed disabled:bg-transparent",
    "[.selected:not(.in-range)_&]:bg-bg-primary-600 [.selected:not(.in-range)_&]:text-txt-white",
    "[.today:not(.selected)_&]:text-txt-primary [.today.selected_&]:text-txt-white",
  ),
  today: "today",
  outside: "text-txt-black-900 opacity-50",
  disabled: "",
  range_start: clx("rounded-l-md", range_cap),
  range_middle:
    "in-range bg-bg-primary-50 *:hover:bg-bg-primary-100 *:focus:bg-bg-primary-100",
  range_end: clx("rounded-r-md", range_cap),
  hidden: "invisible",
};

const Calendar: FC<CalendarProps> = ({
  className,
  classNames,
  locale,
  maxYear = 2099,
  month: _month,
  minYear = 1900,
  showOutsideDays = true,
  yearOrder = "asc",
  nextYearLabel,
  previousYearLabel,
  ...props
}) => {
  const malay = locale?.code?.startsWith("ms") ?? false;
  const nextYear = nextYearLabel ?? (malay ? "Tahun seterusnya" : "Next year");
  const previousYear =
    previousYearLabel ?? (malay ? "Tahun sebelumnya" : "Previous year");
  const [view, setView] = useState<"day" | "month" | "year">("day");

  const today = new Date();
  const [month, setMonth] = useState<Date>(_month ?? today);

  const thisYear = _month?.getFullYear() ?? today.getFullYear();
  const [year, setYear] = useState<number>(thisYear);

  const yearCount = maxYear - minYear + 1;
  const yearRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (view === "year")
      if (yearRef && yearRef.current)
        yearRef.current.scrollIntoView({
          block: "center",
        });
  }, [view]);

  const formatDate = (date: Date, formatStr: string, options?: FormatOptions) =>
    format(date, formatStr, {
      ...options,
      locale: locale as Locale,
    });

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={month}
      onMonthChange={setMonth}
      className={clx(
        // The calendar owns its size: one cell is 40px comfortable, 32px compact, and
        // the width is seven cells plus padding, so popovers can wrap it with w-fit
        calendar_cell_size,
        "w-[calc(var(--cal-cell)*7+1.5rem)] max-w-full p-3 pb-4.5",
        view !== "day" && "h-[342px]",
        className,
      )}
      classNames={{
        months: "relative flex flex-col h-full",
        month: "flex flex-col h-full gap-y-1.5",
        month_caption: "",
        caption_label: "text-label-sm font-medium",
        nav: "absolute right-0 flex gap-2 items-center",
        ...calendar_day_classnames,
        selected: clx(
          "selected",
          props.mode === "single"
            ? "*:bg-bg-primary-600 *:text-txt-white *:hover:bg-bg-primary-600 *:hover:text-txt-white *:focus:bg-bg-primary-600 *:focus:text-txt-white"
            : "",
        ),
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        CaptionLabel(props) {
          const toggle = (monthOrYear: "month" | "year", formatStr: string) => (
            <Button
              variant={view === monthOrYear ? "unset" : "default-ghost"}
              className={clx(
                "text-body-md px-1.5 py-1 font-semibold",
                view === monthOrYear
                  ? "text-txt-primary bg-bg-primary-50 ring-fr-primary focus-visible:ring"
                  : "border-none",
              )}
              onClick={() =>
                setView(view === monthOrYear ? "day" : monthOrYear)
              }
            >
              {formatDate(month, formatStr)}
            </Button>
          );

          return (
            <span
              {...props}
              className="text-bg-black-400 relative flex w-fit items-center gap-0.5 select-none"
            >
              {toggle("month", "LLLL")}/{toggle("year", "yyy")}
            </span>
          );
        },
        MonthGrid(tableProps) {
          return view === "day" ? (
            <table {...tableProps} />
          ) : view === "month" ? (
            <table role="grid" className="table h-full">
              <tbody>
                {[0, 1, 2, 3].map((row_index) => (
                  <tr key={row_index}>
                    {[0, 1, 2].map((col_index) => {
                      const date = new Date();
                      date.setHours(0, 0, 0, 0);

                      let selected_date = date;
                      if (props.mode !== undefined)
                        selected_date = getSelectedDate(
                          props.selected,
                          props.daterange,
                        );

                      const i = row_index * 3 + col_index;

                      date.setTime(
                        dateIn(year, i, selected_date.getDate()).getTime(),
                      );

                      const isSelected =
                        month.getMonth() === i && month.getFullYear() === year;

                      return (
                        <td key={i} role="gridcell">
                          <Button
                            data-selected={isSelected}
                            variant={
                              isSelected ? "primary-fill" : "default-ghost"
                            }
                            disabled={
                              props.disabled
                                ? dateMatchers("month", date, props.disabled)
                                : false
                            }
                            className="h-full w-full justify-center disabled:data-[selected=false]:bg-transparent"
                            onClick={(e) => {
                              setMonth(date);
                              setView("day");

                              if (props.mode !== undefined && props.onSelect) {
                                // Single mode: the month grid only navigates; the day is still to pick
                                if (props.mode === "range") {
                                  if (props.selected) {
                                    const { from, to } = props.selected;
                                    props.onSelect(
                                      props.daterange === "from"
                                        ? { from: date, to }
                                        : { from, to: date },
                                      date,
                                      {},
                                      e,
                                    );
                                  } else
                                    props.onSelect(
                                      props.daterange === "from"
                                        ? { from: date, to: undefined }
                                        : { from: undefined, to: date },
                                      date,
                                      {},
                                      e,
                                    );
                                }
                              }
                            }}
                          >
                            {formatDate(date, "MMM")}
                          </Button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="overflow-y-auto">
              <table role="grid" className="w-full">
                <tbody>
                  {Array(Math.ceil(yearCount / 3))
                    .fill(null)
                    .map((_, row_index) => (
                      <tr key={row_index}>
                        {[0, 1, 2].map((col_index) => {
                          const i = row_index * 3 + col_index;
                          // minYear to maxYear inclusive; pad the last row
                          if (i >= yearCount)
                            return <td key={`empty-${i}`} role="gridcell" />;

                          const displayYear =
                            yearOrder === "asc" ? minYear + i : maxYear - i;
                          const isSelected =
                            month.getFullYear() === displayYear;

                          const date = new Date();
                          date.setHours(0, 0, 0, 0);

                          let selected_date = date;

                          if (props.mode !== undefined)
                            selected_date = getSelectedDate(
                              props.selected,
                              props.daterange,
                            );

                          date.setTime(
                            dateIn(
                              displayYear,
                              selected_date.getMonth(),
                              selected_date.getDate(),
                            ).getTime(),
                          );

                          return (
                            <td key={displayYear} role="gridcell">
                              <Button
                                ref={isSelected ? yearRef : null}
                                data-selected-date={date}
                                data-selected={isSelected}
                                variant={
                                  isSelected ? "primary-fill" : "default-ghost"
                                }
                                className="h-full min-h-11 w-full justify-center disabled:data-[selected=false]:bg-transparent"
                                disabled={
                                  props.disabled
                                    ? dateMatchers("year", date, props.disabled)
                                    : false
                                }
                                onClick={(e) => {
                                  setYear(displayYear);
                                  setMonth(
                                    dateIn(
                                      displayYear,
                                      month.getMonth(),
                                      month.getDate(),
                                    ),
                                  );
                                  setView("month");

                                  if (
                                    props.mode !== undefined &&
                                    props.onSelect
                                  ) {
                                    // Single mode: the year grid only navigates; the day is still to pick
                                    if (props.mode === "range") {
                                      if (props.selected) {
                                        const { from, to } = props.selected;
                                        props.onSelect(
                                          props.daterange === "from"
                                            ? { from: date, to }
                                            : { from, to: date },
                                          date,
                                          {},
                                          e,
                                        );
                                      } else
                                        props.onSelect(
                                          props.daterange === "from"
                                            ? { from: date, to: undefined }
                                            : { from: undefined, to: date },
                                          date,
                                          {},
                                          e,
                                        );
                                    }
                                  }
                                }}
                              >
                                {displayYear}
                              </Button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          );
        },
        NextMonthButton(props) {
          return view === "day" ? (
            <button
              type="button"
              {...props}
              onClick={() => {
                const date = addMonths(month, 1);
                setMonth(date);
                setYear(date.getFullYear());
              }}
              disabled={addMonths(month, 1).getFullYear() > maxYear}
            />
          ) : view === "month" ? (
            <button
              type="button"
              {...props}
              aria-label={nextYear}
              onClick={() => {
                const date = addYears(month, 1);
                setMonth(date);
                setYear(year + 1);
              }}
              disabled={year >= maxYear}
            />
          ) : (
            <></>
          );
        },
        PreviousMonthButton(props) {
          return view === "day" ? (
            <button
              type="button"
              {...props}
              onClick={() => {
                const date = subMonths(month, 1);
                setMonth(date);
                setYear(date.getFullYear());
              }}
              disabled={subMonths(month, 1).getFullYear() < minYear}
            />
          ) : view === "month" ? (
            <button
              type="button"
              {...props}
              aria-label={previousYear}
              onClick={() => {
                const date = subYears(month, 1);
                setMonth(date);
                setYear(year - 1);
              }}
              disabled={year <= minYear}
            />
          ) : (
            <></>
          );
        },
      }}
      formatters={{
        formatWeekdayName: (date, options) => formatDate(date, "ccc", options),
      }}
      {...props}
    />
  );
};
Calendar.displayName = "Calendar";

export {
  Calendar,
  CalendarChevron,
  calendar_cell_size,
  calendar_day_classnames,
  calendar_nav_button,
};

function dateMatchers(
  view: "month" | "year",
  date: Date,
  matchers: Matcher | Matcher[],
  dateLib: DateLib = defaultDateLib,
): boolean {
  const matchersArr = !Array.isArray(matchers) ? [matchers] : matchers;
  const { isSameDay, differenceInCalendarDays, isAfter } = dateLib;
  return matchersArr.some((matcher: Matcher) => {
    if (typeof matcher === "boolean") {
      return matcher;
    }
    if (isDate(matcher)) {
      return isSameDay(date, matcher);
    }
    if (isDatesArray(matcher, dateLib)) {
      return matcher.includes(date);
    }
    if (isDateRange(matcher)) {
      if (view === "month") {
        if (isSameMonth(date, matcher.from!)) return false;
        if (isSameMonth(date, matcher.to!)) return false;
      }
      if (view === "year") {
        if (isSameYear(date, matcher.from!)) return false;
        if (isSameYear(date, matcher.to!)) return false;
      }
      return rangeIncludesDate(matcher, date, false, dateLib);
    }
    if (isDayOfWeekType(matcher)) {
      if (!Array.isArray(matcher.dayOfWeek)) {
        return matcher.dayOfWeek === date.getDay();
      }
      return matcher.dayOfWeek.includes(date.getDay());
    }
    if (isDateInterval(matcher)) {
      const diffBefore = differenceInCalendarDays(matcher.before, date);
      const diffAfter = differenceInCalendarDays(matcher.after, date);
      const isDayBefore = diffBefore > 0;
      const isDayAfter = diffAfter < 0;
      const isClosedInterval = isAfter(matcher.before, matcher.after);
      if (view === "month") {
        if (isSameMonth(date, matcher.before)) return false;
        if (isSameMonth(date, matcher.after)) return false;
      }
      if (view === "year") {
        if (isSameYear(date, matcher.before)) return false;
        if (isSameYear(date, matcher.after)) return false;
      }
      if (isClosedInterval) {
        return isDayAfter && isDayBefore;
      } else {
        return isDayBefore || isDayAfter;
      }
    }
    if (isDateAfterType(matcher)) {
      if (view === "month" && isSameMonth(date, matcher.after)) return false;
      if (view === "year" && isSameYear(date, matcher.after)) return false;
      return differenceInCalendarDays(date, matcher.after) > 0;
    }
    if (isDateBeforeType(matcher)) {
      if (view === "month" && isSameMonth(matcher.before, date)) return false;
      if (view === "year" && isSameYear(matcher.before, date)) return false;
      return differenceInCalendarDays(matcher.before, date) > 0;
    }
    if (typeof matcher === "function") {
      return matcher(date);
    }
    return false;
  });
}

function getSelectedDate(
  selected?: Date | Date[] | DateRange,
  daterange?: "from" | "to",
): Date {
  const date = new Date();
  if (selected === undefined) return date;
  if (isDate(selected)) return selected;
  if (isDateRange(selected)) {
    if (daterange === "from" && selected.from) return selected.from;
    if (daterange === "to" && selected.to) return selected.to;
    return date;
  }
  if (selected.length > 0 && selected[0]) return selected[0];
  return date;
}
