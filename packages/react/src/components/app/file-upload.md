---
title: File Upload
description: Attach documents to a form with a "Choose file" button or by dropping files, then review the list with sizes, errors and remove buttons.
category: Forms and inputs
---

## When to use

- Use `FileUpload` whenever people attach documents: supporting documents, a copy of an IC, bank statements.
- Use `FileUploadItem` (same file) on its own in a `<ul>` to show files uploaded earlier, in the same style.
- If a step only asks for documents, give it its own page in a `FormStep` so the upload doesn't get lost among other questions.

## Usage

Put it in a `Field` and state the accepted types and size in the `FieldDescription`. Files outside `accept` or over `maxSize` (in bytes) stay in the list with an error, so people see which file was rejected and why.

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { FileUpload } from "@/components/ui/file-upload";

export function SupportingDocuments({ error }: { error?: string }) {
  return (
    <Field name="documents" invalid={Boolean(error)}>
      <FieldLabel>Supporting documents</FieldLabel>
      <FieldDescription>PDF or JPG, up to 5 MB each</FieldDescription>
      <FileUpload
        id="documents"
        accept=".pdf,image/jpeg"
        multiple
        maxSize={5 * 1024 * 1024}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

To upload files as they are chosen, control the list with `files` and `onFilesChange`, and set `progress` (0 to 100) or `uploading` on each `FileUploadFile`:

```tsx
import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FileUpload, type FileUploadFile } from "@/components/ui/file-upload";

export function AuditedAccounts({
  upload,
}: {
  upload: (file: File, onProgress: (percent: number) => void) => Promise<void>;
}) {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const update = (id: string, patch: Partial<FileUploadFile>) =>
    setFiles((current) =>
      current.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );

  return (
    <Field name="accounts">
      <FieldLabel>Audited accounts</FieldLabel>
      <FieldDescription>PDF only, up to 10 MB each</FieldDescription>
      <FileUpload
        accept=".pdf"
        multiple
        maxSize={10 * 1024 * 1024}
        files={files}
        onFilesChange={(next) => {
          const added = next.filter(
            (f) => !f.error && !files.some((old) => old.id === f.id),
          );
          setFiles(
            next.map((f) => (added.includes(f) ? { ...f, progress: 0 } : f)),
          );
          added.forEach((f) => {
            upload(f.file, (percent) => update(f.id, { progress: percent }))
              .then(() => update(f.id, { progress: 100 }))
              .catch(() =>
                update(f.id, {
                  error: `${f.file.name} could not be uploaded. Try again.`,
                }),
              );
          });
        }}
      />
    </Field>
  );
}
```

## Notes

- It wraps a real `<input type="file">`, so it joins the surrounding `Field` (label, hint, invalid state) and submits the files without an error with a native form. `name` comes from the `Field`; give it an `id` when an `ErrorSummary` needs to link to it.
- Keyboard and screen reader users reach the visually hidden file input; the "Choose file" button is for pointer users and is hidden from assistive technology.
- Without `multiple`, a new choice replaces the current file.
- A file's `error` doesn't make the field invalid. To block submission, check the files yourself and set `invalid` on the `Field` with a `FieldError` ("Remove the files we can't accept, then continue").
- Default errors say what to do: "scan.pdf is larger than 5 MB. Choose a smaller file." Replace them with `maxSizeMessage` and `acceptMessage`.
- Translate the built-in text with `buttonLabel` ("Choose file" or "Choose files"), `dropLabel` ("or drop file here"), `removeLabel` (a function of the file; default "Remove {file name}") and `uploadingLabel` ("Uploading…").
- A progress bar shows while `progress` is below 100; `uploading` shows a spinner and "Uploading…" in place of the name instead.
- `formatFileSize` (same file) turns bytes into "512 B", "1.2 KB" or "4.8 MB" for your own text.
- Uncontrolled, pass `defaultFiles`. Each `FileUploadFile` needs a stable `id`.
