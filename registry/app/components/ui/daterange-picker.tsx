"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DateRange,
  DayPicker,
  Matcher,
  type MonthCaptionProps,
  rangeContainsModifiers,
} from "react-day-picker";
import { enGB, ms } from "date-fns/locale";
import {
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  type Locale,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { VariantProps } from "class-variance-authority";
import { useControllableState, useMediaQuery } from "@/lib/ftds/hooks";
import { Button, ButtonIcon, button_cva } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@/components/ui/icons/calendar";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { clx } from "@/lib/ftds/utils";
import {
  CalendarChevron,
  calendar_cell_size,
  calendar_day_classnames,
  calendar_nav_button,
} from "@/components/ui/calendar";

/**
 * DateRangePicker picks a start and an end date from one control: a single trigger that
 * opens two months side by side (one on phones). Click the start date, then the end
 * date; the range is set and the popup closes. While choosing, the days up to the
 * pointer are previewed, and the footer shows the range and its length.
 *
 * Pass `presets` for quick ranges beside the calendar (`true` for Today, Last 7 days,
 * Last 30 days, This month, Last month and This year, or your own list).
 *
 * @example
 * <DateRangePicker presets value={range} onValueChange={setRange} />
 */

interface DateRangePreset {
  label: string;
  /** Called when the preset is chosen, so relative ranges stay current. */
  range: () => { from: Date; to: Date };
}

interface DateRangePickerLabels {
  /** Trigger text when nothing is chosen. */
  placeholder: string;
  clear: string;
  /** Footer prompt before the first click. */
  chooseStart: string;
  /** Footer prompt after the first click. */
  chooseEnd: string;
  /** Length of the range in the footer. */
  days: (count: number) => string;
  /** Accessible name of the presets list. */
  presets: string;
  /** The caption button that opens the month grid. */
  chooseMonth: string;
  /** The caption button that opens the year grid, and its heading. */
  chooseYear: string;
  previousYear: string;
  nextYear: string;
  /** The year grid's way back to the months. */
  backToMonths: string;
}

const LABELS: Record<"en" | "ms", DateRangePickerLabels> = {
  en: {
    placeholder: "Select dates",
    clear: "Clear",
    chooseStart: "Choose a start date",
    chooseEnd: "Choose an end date",
    days: (count) => (count === 1 ? "1 day" : `${count} days`),
    presets: "Quick ranges",
    chooseMonth: "Choose month",
    chooseYear: "Choose year",
    previousYear: "Previous year",
    nextYear: "Next year",
    backToMonths: "Back to months",
  },
  ms: {
    placeholder: "Pilih tarikh",
    clear: "Kosongkan",
    chooseStart: "Pilih tarikh mula",
    chooseEnd: "Pilih tarikh akhir",
    days: (count) => `${count} hari`,
    presets: "Julat pantas",
    chooseMonth: "Pilih bulan",
    chooseYear: "Pilih tahun",
    previousYear: "Tahun sebelumnya",
    nextYear: "Tahun seterusnya",
    backToMonths: "Kembali ke bulan",
  },
};

const PRESET_NAMES: Record<"en" | "ms", string[]> = {
  en: [
    "Today",
    "Last 7 days",
    "Last 30 days",
    "This month",
    "Last month",
    "This year",
  ],
  ms: [
    "Hari ini",
    "7 hari lepas",
    "30 hari lepas",
    "Bulan ini",
    "Bulan lepas",
    "Tahun ini",
  ],
};

const today = () => startOfDay(new Date());

/** The default ranges, in PRESET_NAMES order; each is worked out when chosen. */
const PRESET_RANGES: DateRangePreset["range"][] = [
  () => ({ from: today(), to: today() }),
  () => ({ from: subDays(today(), 6), to: today() }),
  () => ({ from: subDays(today(), 29), to: today() }),
  () => ({ from: startOfMonth(today()), to: today() }),
  () => {
    const last = subMonths(today(), 1);
    return { from: startOfMonth(last), to: startOfDay(endOfMonth(last)) };
  },
  () => ({ from: startOfYear(today()), to: today() }),
];

const presetsFor = (locale: "en" | "ms"): DateRangePreset[] =>
  PRESET_RANGES.map((range, i) => ({ label: PRESET_NAMES[locale][i]!, range }));

const DEFAULT_PRESETS: Record<"en" | "ms", DateRangePreset[]> = {
  en: presetsFor("en"),
  ms: presetsFor("ms"),
};

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  /** Days that can't be chosen; `true` disables the whole picker. */
  disabled?: Matcher | Matcher[];
  /** Restart the range when it would span a disabled day. */
  excludeDisabled?: boolean;
  /** Quick ranges beside the calendar: `true` for the defaults, or your own list. */
  presets?: boolean | DateRangePreset[];
  /** date-fns format for the trigger and footer. @default "d MMM yyyy" */
  formatStr?: string;
  locale?: "en" | "ms";
  minYear?: number;
  maxYear?: number;
  /** @deprecated Use `labels.placeholder`. */
  placeholder?: string;
  labels?: Partial<DateRangePickerLabels>;
  size?: VariantProps<typeof button_cva>["size"];
  /** Popup alignment to the trigger. @default "start" */
  align?: "start" | "center" | "end";
  className?: string;
  /** On the trigger button: point a `FieldLabel`'s `htmlFor` (or an `ErrorSummary` error) at it. */
  id?: string;
  /**
   * Submits the range in a native form post under this name, as an ISO 8601
   * interval: `2026-01-01/2026-03-31` (empty until both ends are chosen).
   */
  name?: string;
  /** Shows the error style on the trigger. */
  invalid?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

const preset_button = clx(
  "text-txt-black-700 text-label-sm hover:bg-bg-washed-active hover:text-txt-black-900 flex h-8 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-md px-3 text-left",
  "aria-pressed:bg-bg-primary-50 aria-pressed:text-txt-primary transition-colors duration-150 motion-reduce:transition-none focus-ring",
);

/** Month name and year in each caption: quiet buttons that open the jump grids. */
const caption_button = clx(
  "text-txt-black-900 text-label-md hover:bg-bg-washed inline-flex h-7 cursor-pointer items-center rounded-md px-1.5 font-semibold",
  "transition-colors duration-150 motion-reduce:transition-none focus-ring",
);

/** A month or year in the jump grids; the month or year on show takes the Blue Wash. */
const jump_cell = clx(
  "text-txt-black-900 text-label-sm hover:bg-bg-washed flex min-h-9 cursor-pointer items-center justify-center rounded-md",
  "aria-[current=true]:bg-bg-primary-50 aria-[current=true]:text-txt-primary aria-[current=true]:font-semibold",
  "disabled:text-txt-black-disabled disabled:cursor-not-allowed disabled:bg-transparent",
  "transition-colors duration-150 motion-reduce:transition-none focus-ring",
);

const jump_nav = clx(calendar_nav_button, "[&>svg]:size-4");

type Jump = {
  view: "month" | "year";
  /** Which of the shown months the jump replaces: 0 left, 1 right. */
  index: number;
  year: number;
};

const range_classnames = {
  ...calendar_day_classnames,
  months: "relative flex gap-6",
  // Room for six weeks (caption 32 + gap 6 + weekdays 34 + six rows of cell + 6),
  // so the popup keeps its height from month to month
  month: "flex min-h-[calc(var(--cal-cell)*6+6.75rem)] flex-col gap-y-1.5",
  month_caption: "flex h-8 items-center justify-center gap-0.5",
  // Spans the caption row for the arrows; click-through so the captions work
  nav: "pointer-events-none absolute inset-x-0 top-0 flex justify-between [&>button]:pointer-events-auto",
  selected: "selected",
  // The preview band: Well, rounded at the pointer
  day: clx(
    calendar_day_classnames.day,
    "[&.preview:not(.selected)]:bg-bg-washed [&.preview-end]:rounded-r-md",
  ),
};

const range_modifier_classnames = {
  preview: "preview",
  preview_end: "preview-end",
};

/** What the captions need from the picker; a context so the caption can live at module scope. */
const CaptionContext = createContext<{
  openJump: (jump: Jump) => void;
  labels: DateRangePickerLabels;
  dateLocale: Locale;
} | null>(null);

/** Each month's caption: its name and year are buttons that open the jump grids. */
const RangeMonthCaption = ({
  calendarMonth,
  displayIndex,
  ...captionProps
}: MonthCaptionProps) => {
  const { openJump, labels, dateLocale } = useContext(CaptionContext)!;
  const date = calendarMonth.date;
  const year = date.getFullYear();
  return (
    <div {...captionProps}>
      <button
        type="button"
        className={caption_button}
        aria-label={`${labels.chooseMonth}, ${format(date, "LLLL yyyy", { locale: dateLocale })}`}
        onClick={() => openJump({ view: "month", index: displayIndex, year })}
      >
        {format(date, "LLLL", { locale: dateLocale })}
      </button>
      <button
        type="button"
        className={caption_button}
        aria-label={`${labels.chooseYear}, ${year}`}
        onClick={() => openJump({ view: "year", index: displayIndex, year })}
      >
        {year}
      </button>
    </div>
  );
};

const range_components = {
  Chevron: CalendarChevron,
  MonthCaption: RangeMonthCaption,
};

const DateRangePicker = ({
  value,
  defaultValue,
  onValueChange,
  disabled,
  excludeDisabled = false,
  presets,
  formatStr = "d MMM yyyy",
  locale = "en",
  minYear = 1900,
  maxYear = 2099,
  placeholder,
  labels: labelsProp,
  size,
  align = "start",
  className,
  id,
  name,
  invalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  "aria-describedby": ariaDescribedby,
}: DateRangePickerProps) => {
  const labels = useMemo(
    () => ({
      ...LABELS[locale],
      ...(placeholder ? { placeholder } : {}),
      ...labelsProp,
    }),
    [locale, placeholder, labelsProp],
  );
  const dateLocale = locale === "ms" ? ms : enGB;
  const fmt = (date: Date) => format(date, formatStr, { locale: dateLocale });

  const [range, setRange] = useControllableState<DateRange | undefined>({
    prop: value,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });
  const [open, setOpen] = useState(false);
  // The range being chosen; only a finished range reaches `value`
  const [draft, setDraft] = useState<DateRange | undefined>(range);
  const [hovered, setHovered] = useState<Date>();
  const [month, setMonth] = useState<Date>(range?.from ?? new Date());
  const twoMonths = useMediaQuery("(min-width: 640px)");
  // Month or year grid opened from a caption; the days stay underneath, inert
  const [jump, setJump] = useState<Jump | null>(null);
  // The month or year on show; focused when a grid opens
  const currentCellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!jump) return;
    currentCellRef.current?.focus();
    currentCellRef.current?.scrollIntoView({ block: "center" });
    // Only when a grid opens or switches, not when the year arrows step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump?.view, jump?.index]);

  const presetList =
    presets === true ? DEFAULT_PRESETS[locale] : presets || undefined;

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setDraft(range);
      setHovered(undefined);
      setMonth(range?.from ?? new Date());
      setJump(null);
    }
  };

  const goToMonth = (year: number, monthIndex: number) => {
    const target = new Date(year, monthIndex, 1);
    // Picked from the right caption: keep the chosen month on the right
    setMonth(jump?.index === 1 ? subMonths(target, 1) : target);
    setJump(null);
  };

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        format(new Date(2000, i, 1), "LLL", { locale: dateLocale }),
      ),
    [dateLocale],
  );
  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear],
  );
  const bounds = useMemo(
    () => ({ start: new Date(minYear, 0), end: new Date(maxYear, 11) }),
    [minYear, maxYear],
  );
  const formatters = useMemo(
    () => ({
      formatWeekdayName: (date: Date) =>
        format(date, "ccc", { locale: dateLocale }),
    }),
    [dateLocale],
  );
  const captionContext = useMemo(
    () => ({ openJump: setJump, labels, dateLocale }),
    [labels, dateLocale],
  );

  const commit = (next: DateRange) => {
    setDraft(next);
    setRange(next);
    setOpen(false);
  };

  const onDayClick = (day: Date, modifiers: { disabled?: boolean }) => {
    if (modifiers.disabled) return;
    // First click, or a click after a finished range or before the start: a new start
    if (!draft?.from || draft.to || isBefore(day, draft.from)) {
      setDraft({ from: day, to: undefined });
      return;
    }
    const next = { from: draft.from, to: day };
    if (excludeDisabled && disabled && rangeContainsModifiers(next, disabled)) {
      setDraft({ from: day, to: undefined });
      return;
    }
    commit(next);
  };

  // Days between the start and the pointer while the end is being chosen
  const preview =
    draft?.from && !draft.to && hovered && isAfter(hovered, draft.from)
      ? { from: draft.from, to: hovered }
      : undefined;

  // Worked out when the range changes, not on every hover
  const activePreset = useMemo(() => {
    if (!presetList || !range?.from || !range.to) return undefined;
    const { from, to } = range;
    return presetList.find((preset) => {
      const r = preset.range();
      return isSameDay(r.from, from) && isSameDay(r.to, to);
    })?.label;
  }, [presetList, range]);

  // The month on show at the jump's side (the right one is a month after the left)
  const jumpShown = jump ? addMonths(month, jump.index) : undefined;

  const summary =
    draft?.from && draft.to
      ? `${fmt(draft.from)} – ${fmt(draft.to)} · ${labels.days(
          differenceInCalendarDays(draft.to, draft.from) + 1,
        )}`
      : draft?.from
        ? labels.chooseEnd
        : labels.chooseStart;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        disabled={disabled === true}
        render={
          <Button
            variant="default-outline"
            size={size}
            id={id}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            aria-invalid={invalid || undefined}
            className={clx(
              "whitespace-nowrap",
              invalid && "ring-fr-danger ring",
              className,
            )}
          />
        }
      >
        <ButtonIcon>
          <CalendarIcon />
        </ButtonIcon>
        {range?.from ? (
          <span className="tabular-nums">
            {fmt(range.from)} – {range.to ? fmt(range.to) : "…"}
          </span>
        ) : (
          <span className="text-txt-black-700 font-normal">
            {labels.placeholder}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-fit max-w-[calc(100vw-2rem)] overflow-hidden p-0"
        align={align}
      >
        {/* On phones the column is one month wide; the presets row scrolls inside it */}
        <div
          className={clx(
            calendar_cell_size,
            "flex w-[calc(var(--cal-cell)*7+1.5rem)] max-w-full flex-col sm:w-auto sm:flex-row",
          )}
        >
          {presetList && (
            <div
              role="group"
              aria-label={labels.presets}
              className="bg-bg-washed flex min-w-0 [scrollbar-width:none] gap-1 overflow-x-auto p-2 sm:w-40 sm:flex-col sm:overflow-visible"
            >
              {presetList.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={preset.label === activePreset}
                  className={preset_button}
                  onClick={() => {
                    const next = preset.range();
                    setMonth(twoMonths ? subMonths(next.to, 1) : next.to);
                    commit(next);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col">
            <div className="relative">
              <div
                inert={jump ? true : undefined}
                className={clx(jump && "invisible")}
              >
                <CaptionContext.Provider value={captionContext}>
                  <DayPicker
                    mode="range"
                    selected={draft}
                    // Selection is handled in onDayClick so a third click starts a new range
                    onSelect={() => {}}
                    onDayClick={onDayClick}
                    // Only while choosing the end, and only when the day changes
                    onDayMouseEnter={(day) => {
                      if (draft?.from && !draft.to)
                        setHovered((h) => (h && isSameDay(h, day) ? h : day));
                    }}
                    month={month}
                    onMonthChange={setMonth}
                    numberOfMonths={twoMonths ? 2 : 1}
                    showOutsideDays={!twoMonths}
                    startMonth={bounds.start}
                    endMonth={bounds.end}
                    disabled={disabled}
                    locale={dateLocale}
                    modifiers={
                      preview ? { preview, preview_end: preview.to } : undefined
                    }
                    modifiersClassNames={range_modifier_classnames}
                    className="p-3"
                    classNames={range_classnames}
                    formatters={formatters}
                    components={range_components}
                  />
                </CaptionContext.Provider>
              </div>

              {jump && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                <div
                  role="group"
                  aria-label={
                    jump.view === "month"
                      ? labels.chooseMonth
                      : labels.chooseYear
                  }
                  className="absolute inset-0 flex flex-col gap-3 p-3"
                  onKeyDown={(event) => {
                    // Escape steps back to the days instead of closing the popup
                    if (event.key !== "Escape") return;
                    event.stopPropagation();
                    if (jump.view === "year")
                      setJump({ ...jump, view: "month" });
                    else setJump(null);
                  }}
                >
                  {jump.view === "month" ? (
                    <>
                      <div className="flex h-8 items-center justify-between">
                        <button
                          type="button"
                          className={jump_nav}
                          aria-label={labels.previousYear}
                          disabled={jump.year <= minYear}
                          onClick={() =>
                            setJump({ ...jump, year: jump.year - 1 })
                          }
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button
                          type="button"
                          className={caption_button}
                          aria-label={`${labels.chooseYear}, ${jump.year}`}
                          onClick={() => setJump({ ...jump, view: "year" })}
                        >
                          {jump.year}
                        </button>
                        <button
                          type="button"
                          className={jump_nav}
                          aria-label={labels.nextYear}
                          disabled={jump.year >= maxYear}
                          onClick={() =>
                            setJump({ ...jump, year: jump.year + 1 })
                          }
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                      <div
                        role="group"
                        aria-label={labels.chooseMonth}
                        className="grid flex-1 grid-cols-3 gap-2"
                      >
                        {months.map((name, i) => {
                          const current =
                            jumpShown?.getFullYear() === jump.year &&
                            jumpShown.getMonth() === i;
                          return (
                            <button
                              key={name}
                              type="button"
                              ref={current ? currentCellRef : undefined}
                              className={jump_cell}
                              aria-current={current || undefined}
                              onClick={() => goToMonth(jump.year, i)}
                            >
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 items-center justify-between">
                        <button
                          type="button"
                          className={jump_nav}
                          aria-label={labels.backToMonths}
                          onClick={() => setJump({ ...jump, view: "month" })}
                        >
                          <ChevronLeftIcon />
                        </button>
                        <span className="text-txt-black-900 text-label-md font-semibold">
                          {labels.chooseYear}
                        </span>
                        <span className="size-8" aria-hidden />
                      </div>
                      <div
                        role="group"
                        aria-label={labels.chooseYear}
                        className="grid min-h-0 flex-1 auto-rows-[2.25rem] grid-cols-4 gap-2 overflow-y-auto"
                      >
                        {years.map((year) => {
                          const current = year === jump.year;
                          return (
                            <button
                              key={year}
                              ref={current ? currentCellRef : undefined}
                              type="button"
                              className={jump_cell}
                              aria-current={current || undefined}
                              onClick={() =>
                                setJump({ ...jump, view: "month", year })
                              }
                            >
                              {year}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex min-h-11 items-center justify-between gap-3 px-3 pb-3">
              <span
                aria-live="polite"
                className="text-txt-black-700 text-label-sm text-pretty tabular-nums"
              >
                {summary}
              </span>
              {(draft?.from || range?.from) && (
                <Button
                  variant="default-ghost"
                  size="small"
                  onClick={() => {
                    setDraft(undefined);
                    setRange(undefined);
                  }}
                >
                  {labels.clear}
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            range?.from && range.to
              ? `${format(range.from, "yyyy-MM-dd")}/${format(range.to, "yyyy-MM-dd")}`
              : ""
          }
        />
      )}
    </Popover>
  );
};
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
export type { DateRange, DateRangePreset, DateRangePickerLabels };
