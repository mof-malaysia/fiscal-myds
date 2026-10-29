---
title: Activity Timeline
description: The history of a case, one event per line (who did what, when), with comments, attachments and an optional note composer. For officer case pages.
---

## When to use

- Use `ActivityTimeline` on an officer's case page to show what has happened to the case: submitted, assigned, notes, status changes, decisions and documents.
- Use `DecisionPanel` beside it to record the decision itself, and `WorkQueue` for the list of cases the officer opens it from.
- Use `NotificationList` for a citizen's inbox of updates, and `Stepper` or `TaskList` to show where an application stands rather than what happened to it.

## Usage

Each event has a `kind` (`"submitted"`, `"assigned"`, `"comment"`, `"status"`, `"decision"` or `"document"`), an `actor`, an `action` that follows the actor's name, and `at` (a `Date` or ISO string). Events render in the order you give them. With `onAddNote` the note composer appears; put it at the `"top"` (the default) for newest-first lists.

```tsx
import { useState } from "react";
import {
  ActivityTimeline,
  type ActivityEvent,
} from "@/components/blocks/activity-timeline";

const initialEvents: ActivityEvent[] = [
  {
    id: "4",
    kind: "comment",
    actor: { name: "Nur Aisyah binti Ahmad", role: "Reviewing officer" },
    action: "added a note",
    at: "2026-10-21T10:45:00+08:00",
    comment: "EA form for 2025 is missing. Asked the applicant to upload it.",
  },
  {
    id: "3",
    kind: "document",
    actor: { name: "Tan Wei Ming", role: "Applicant" },
    action: "uploaded a document",
    at: "2026-10-21T09:02:00+08:00",
    attachment: {
      name: "Resit-perubatan-2025.pdf",
      href: "/files/MOF-2026-0412/1",
      size: "240 KB",
    },
  },
  {
    id: "2",
    kind: "assigned",
    actor: { name: "Nur Aisyah binti Ahmad" },
    action: "assigned the case to themself",
    at: "2026-10-20T14:30:00+08:00",
  },
  {
    id: "1",
    kind: "submitted",
    actor: { name: "Tan Wei Ming", role: "Applicant" },
    action: "submitted application MOF-2026-0412",
    at: "2026-10-20T09:12:00+08:00",
  },
];

export function CaseHistory({
  saveNote,
}: {
  saveNote: (text: string) => Promise<void>;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <ActivityTimeline
      events={events}
      pending={saving}
      noteError={error}
      locale="en-MY"
      onAddNote={async (text) => {
        setSaving(true);
        setError(undefined);
        try {
          await saveNote(text);
          setEvents((current) => [
            {
              id: String(current.length + 1),
              kind: "comment",
              actor: {
                name: "Nur Aisyah binti Ahmad",
                role: "Reviewing officer",
              },
              action: "added a note",
              at: new Date(),
              comment: text,
            },
            ...current,
          ]);
        } catch {
          setError("The note was not saved. Try again.");
        } finally {
          setSaving(false);
        }
      }}
    />
  );
}
```

Oldest first, with the composer below and Bahasa Melayu labels. `labels.kinds` names the badge icons for screen readers:

```tsx
import {
  ActivityTimeline,
  type ActivityEvent,
} from "@/components/blocks/activity-timeline";

export function SejarahKes({
  events,
  onAddNote,
}: {
  events: ActivityEvent[];
  onAddNote: (text: string) => Promise<void>;
}) {
  return (
    <ActivityTimeline
      events={events}
      composer="bottom"
      locale="ms-MY"
      onAddNote={onAddNote}
      labels={{
        list: "Aktiviti kes",
        empty: "Tiada aktiviti lagi.",
        noteLabel: "Tambah catatan",
        notePlaceholder: "Catatan hanya dilihat oleh pegawai",
        addNote: "Tambah catatan",
        kinds: {
          submitted: "Dihantar",
          assigned: "Ditugaskan",
          comment: "Komen",
          status: "Perubahan status",
          decision: "Keputusan",
          document: "Dokumen",
        },
      }}
    />
  );
}
```

## Notes

- Each event shows the actor's avatar (initials from `name` unless you pass `initials` or `avatarUrl`) with a small badge icon for its kind, so the kind never rests on colour alone.
- Times show as relative text ("2 days ago") with the full date and time in the `title`, formatted with `locale` (the browser's by default). Relative times are worked out on render and don't tick; pass `now` for fixed output in tests.
- The block doesn't sort `events` or add new ones: update `events` yourself after a note saves.
- The composer submits on its button or Ctrl/⌘+Enter and ignores empty notes. It clears the text once `onAddNote` returns or its promise resolves, even when you then show a `noteError`; the text stays only if the promise rejects, and the block doesn't catch that rejection. Set `pending` while saving so the officer can't send the note twice.
- Notes in the default placeholder are "visible to officers only"; change `labels.notePlaceholder` if yours are shared with the applicant.
- The installed file is yours: edit it when you need something the props don't cover, such as more event kinds.
