"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  ReactNode,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../core/avatar";
import { Button } from "../core/button";
import { Field, FieldError, FieldLabel } from "../core/field";
import { TextArea } from "../core/textarea";
import { AttachmentIcon } from "../../icons/attachment";
import { ChatBubbleIcon } from "../../icons/chat-bubble";
import { CheckCircleIcon } from "../../icons/check-circle";
import { DocumentIcon } from "../../icons/document";
import { SwapIcon } from "../../icons/swap";
import { UserIcon } from "../../icons/user";
import { clx } from "../../utils";

/**
 * ActivityTimeline is the history of a case, one event per line: who did what and
 * when, with an optional comment and attachment. Each event shows the actor's avatar
 * with a small badge for its kind (submitted, assigned, comment, status change,
 * decision, document), so the kind never rests on colour alone.
 *
 * Pass `onAddNote` to show a note composer above (`composer="top"`, for newest-first
 * lists) or below the events. Events render in the order given.
 *
 * @example
 * <ActivityTimeline
 *   events={[
 *     { id: "1", kind: "submitted", actor: { name: "Syarikat Maju Jaya" }, action: "submitted the application", at: "2026-10-20T09:12:00+08:00" },
 *     { id: "2", kind: "assigned", actor: { name: "Nur Aisyah" }, action: "assigned the case to themself", at: "2026-10-21T10:30:00+08:00" },
 *     { id: "3", kind: "comment", actor: { name: "Nur Aisyah" }, action: "added a note", at: "2026-10-21T10:45:00+08:00", comment: "Bank statement for August is missing." },
 *   ]}
 *   onAddNote={(text) => addNote(text)}
 * />
 */

type ActivityKind =
  | "submitted"
  | "assigned"
  | "comment"
  | "status"
  | "decision"
  | "document";

interface ActivityActor {
  name: string;
  /** Up to two letters; derived from `name` when omitted. */
  initials?: string;
  avatarUrl?: string;
  /** Shown after the name, e.g. "Applicant" or "Reviewing officer". */
  role?: string;
}

interface ActivityAttachment {
  name: string;
  href?: string;
  /** E.g. "240 KB". */
  size?: string;
}

interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  actor: ActivityActor;
  /** What happened, after the actor's name: "approved the application". */
  action: ReactNode;
  /** When it happened (Date or ISO string). */
  at: Date | string;
  comment?: ReactNode;
  attachment?: ActivityAttachment;
}

interface ActivityTimelineLabels {
  /** Accessible name of the list. */
  list: string;
  empty: string;
  noteLabel: string;
  notePlaceholder: string;
  addNote: string;
  /** Spoken names of the event kinds (the badge icons). */
  kinds: Record<ActivityKind, string>;
}

const DEFAULT_LABELS: ActivityTimelineLabels = {
  list: "Case activity",
  empty: "No activity yet.",
  noteLabel: "Add a note",
  notePlaceholder: "Notes are visible to officers only",
  addNote: "Add note",
  kinds: {
    submitted: "Submitted",
    assigned: "Assigned",
    comment: "Comment",
    status: "Status change",
    decision: "Decision",
    document: "Document",
  },
};

const KIND_ICON: Record<ActivityKind, ReactNode> = {
  submitted: <DocumentIcon />,
  assigned: <UserIcon />,
  comment: <ChatBubbleIcon />,
  status: <SwapIcon />,
  decision: <CheckCircleIcon />,
  document: <AttachmentIcon />,
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => /^[^\s&·()-]/.test(word))
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join("");

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

function relativeTime(
  date: Date,
  now: Date,
  format: Intl.RelativeTimeFormat,
): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return format.format(Math.round(seconds / size), unit);
    }
  }
  return format.format(0, "minute");
}

interface ActivityTimelineProps
  extends Omit<ComponentProps<"div">, "children"> {
  events: ActivityEvent[];
  /** Shows the composer when set; resolves (or not) as the app saves the note. */
  onAddNote?: (text: string) => void | Promise<void>;
  /** Where the composer sits. Use "top" for newest-first lists. @default "top" */
  composer?: "top" | "bottom";
  /** Disables the composer while the note saves. */
  pending?: boolean;
  /** Error from saving the note. */
  noteError?: ReactNode;
  /** Locale for dates and relative times. Defaults to the browser's. */
  locale?: string;
  /** "Now" for relative times (stories, tests). Defaults to the current time. */
  now?: Date;
  labels?: Partial<Omit<ActivityTimelineLabels, "kinds">> & {
    kinds?: Partial<ActivityTimelineLabels["kinds"]>;
  };
}

const NoteComposer = ({
  onAddNote,
  pending,
  error,
  labels,
}: {
  onAddNote: (text: string) => void | Promise<void>;
  pending: boolean;
  error?: ReactNode;
  labels: ActivityTimelineLabels;
}) => {
  const [note, setNote] = useState("");
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const text = note.trim();
        if (!text) return;
        await onAddNote(text);
        setNote("");
      }}
    >
      <Field invalid={!!error}>
        <FieldLabel className="sr-only">{labels.noteLabel}</FieldLabel>
        <TextArea
          size="small"
          className="min-h-[72px]"
          placeholder={labels.notePlaceholder}
          value={note}
          disabled={pending}
          onChange={(event) => setNote(event.target.value)}
          onKeyDown={(event) => {
            // ⌘/Ctrl+Enter saves, the convention for multi-line composers
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        {error && <FieldError>{error}</FieldError>}
      </Field>
      <Button
        type="submit"
        variant="default-outline"
        size="small"
        className="self-end"
        disabled={pending || !note.trim()}
      >
        {labels.addNote}
      </Button>
    </form>
  );
};

const ActivityTimeline = forwardRef<HTMLDivElement, ActivityTimelineProps>(
  (
    {
      events,
      onAddNote,
      composer = "top",
      pending = false,
      noteError,
      locale,
      now,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = {
      ...DEFAULT_LABELS,
      ...labelsProp,
      kinds: { ...DEFAULT_LABELS.kinds, ...labelsProp?.kinds },
    };
    const reference = now ?? new Date();
    const [relative, absolute] = useMemo(
      () => [
        new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
        new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      ],
      [locale],
    );

    // Its own component, so typing a note doesn't re-render the events
    const noteForm = onAddNote && (
      <NoteComposer
        onAddNote={onAddNote}
        pending={pending}
        error={noteError}
        labels={labels}
      />
    );

    return (
      <div
        ref={ref}
        className={clx("font-body flex flex-col gap-4", className)}
        {...props}
      >
        {composer === "top" && noteForm}
        {events.length === 0 ? (
          <p className="text-txt-black-700 text-content">{labels.empty}</p>
        ) : (
          <ol
            aria-label={labels.list}
            className="m-0 flex list-none flex-col p-0"
          >
            {events.map((event, i) => {
              const date = new Date(event.at);
              const last = i === events.length - 1;
              return (
                <li
                  key={event.id}
                  className="relative flex gap-3 pb-4 last:pb-0"
                >
                  {/* The line joining this event to the next */}
                  {!last && (
                    <span
                      aria-hidden
                      className="bg-otl-gray-200 absolute top-8 bottom-0 left-3.5 w-px"
                    />
                  )}
                  <span className="relative flex shrink-0 self-start">
                    <Avatar size="small">
                      {event.actor.avatarUrl && (
                        <AvatarImage src={event.actor.avatarUrl} alt="" />
                      )}
                      <AvatarFallback>
                        {event.actor.initials ?? initialsOf(event.actor.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      role="img"
                      aria-label={labels.kinds[event.kind]}
                      className={clx(
                        "bg-bg-white text-txt-black-700 ring-bg-white absolute -right-1.5 -bottom-1.5 grid size-4 place-content-center rounded-full ring-2",
                        "[&>svg]:size-2.5",
                        event.kind === "decision" && "text-txt-success",
                      )}
                    >
                      {KIND_ICON[event.kind]}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-txt-black-700 text-content m-0">
                      <span className="text-txt-black-900 font-medium">
                        {event.actor.name}
                      </span>
                      {event.actor.role && (
                        <span className="text-txt-black-500">
                          {" "}
                          · {event.actor.role}
                        </span>
                      )}{" "}
                      {event.action}
                    </p>
                    <time
                      dateTime={date.toISOString()}
                      title={absolute.format(date)}
                      className="text-txt-black-500 text-label-compact block"
                    >
                      {relativeTime(date, reference, relative)}
                    </time>
                    {event.comment && (
                      <div className="bg-bg-washed text-txt-black-900 text-content mt-2 rounded-md px-3 py-2 whitespace-pre-line">
                        {event.comment}
                      </div>
                    )}
                    {event.attachment && (
                      <a
                        href={event.attachment.href}
                        className={clx(
                          "bg-bg-washed text-txt-black-900 text-label-md mt-2 flex w-fit max-w-full items-center gap-2 rounded-md px-2.5 py-1.5 no-underline",
                          event.attachment.href &&
                            "hover:bg-bg-washed-active focus-ring",
                        )}
                      >
                        <AttachmentIcon
                          aria-hidden
                          className="text-txt-black-700 size-4 shrink-0"
                        />
                        <span className="truncate">
                          {event.attachment.name}
                        </span>
                        {event.attachment.size && (
                          <span className="text-txt-black-500 shrink-0">
                            {event.attachment.size}
                          </span>
                        )}
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {composer === "bottom" && noteForm}
      </div>
    );
  },
);
ActivityTimeline.displayName = "ActivityTimeline";

export { ActivityTimeline };
export type {
  ActivityTimelineProps,
  ActivityTimelineLabels,
  ActivityEvent,
  ActivityActor,
  ActivityAttachment,
  ActivityKind,
};
