import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  ActivityTimeline,
  type ActivityEvent,
} from "@mof-malaysia/ftds-react/activity-timeline";
import { EVENTS, ME, NOW } from "./components/app/officer-data";

/**
 * ### Overview
 * The history of a case, one event per line: who did what and when, with an
 * optional comment and attachment. Each actor's avatar carries a small badge for
 * the event's kind (submitted, assigned, comment, status change, decision,
 * document), so the kind is never shown by colour alone. Hover a time for the
 * full date.
 *
 * Pass `onAddNote` to show a note composer; <kbd>⌘</kbd>/<kbd>Ctrl</kbd> +
 * <kbd>Enter</kbd> saves it.
 *
 * ### Usage
 * ```tsx
 * <ActivityTimeline
 *   events={events}
 *   onAddNote={(text) => api.addNote(caseId, text)}
 * />
 * ```
 */
const meta: Meta<typeof ActivityTimeline> = {
  title: "App/Blocks/ActivityTimeline",
  component: ActivityTimeline,
  parameters: { layout: "padded" },
};

export default meta;

const WithComposer = ({ composer }: { composer?: "top" | "bottom" }) => {
  const [events, setEvents] = React.useState<ActivityEvent[]>(EVENTS);
  const add = (text: string) => {
    const event: ActivityEvent = {
      id: String(Date.now()),
      kind: "comment",
      actor: { name: ME, role: "Reviewing officer" },
      action: "added a note",
      at: NOW,
      comment: text,
    };
    setEvents((list) =>
      composer === "bottom" ? [...list, event] : [event, ...list],
    );
  };
  return (
    <ActivityTimeline
      events={composer === "bottom" ? [...EVENTS].reverse() : events}
      onAddNote={add}
      composer={composer}
      now={NOW}
    />
  );
};

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div data-density="compact" className="bg-bg-white max-w-xl">
    {children}
  </div>
);

/** Newest first, composer on top. */
export const Default = createRender(() => (
  <Frame>
    <WithComposer />
  </Frame>
));

/** Oldest first, composer underneath, like a conversation. */
export const ComposerBelow = createRender(() => (
  <Frame>
    <WithComposer composer="bottom" />
  </Frame>
));

/** Without `onAddNote`, a read-only history. */
export const ReadOnly = createRender(() => (
  <Frame>
    <ActivityTimeline events={EVENTS} now={NOW} />
  </Frame>
));

export const WithDecision = createRender(() => (
  <Frame>
    <ActivityTimeline
      now={NOW}
      events={[
        {
          id: "d1",
          kind: "decision",
          actor: { name: ME, role: "Reviewing officer" },
          action: (
            <>
              <strong className="font-medium">approved</strong> the application
            </>
          ),
          at: "2026-10-29T14:30:00+08:00",
          comment: "All documents verified. Refund to be paid within 14 days.",
        },
        ...EVENTS,
      ]}
    />
  </Frame>
));

export const Empty = createRender(() => (
  <Frame>
    <ActivityTimeline events={[]} onAddNote={() => {}} now={NOW} />
  </Frame>
));

/** A save that failed: the error sits under the composer. */
export const NoteError = createRender(() => (
  <Frame>
    <ActivityTimeline
      events={EVENTS.slice(0, 2)}
      onAddNote={() => {}}
      noteError="The note wasn't saved. Check your connection and try again."
      now={NOW}
    />
  </Frame>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Frame>
        <WithComposer />
      </Frame>
    </div>
  ),
  "dark",
);
