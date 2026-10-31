import React, { useEffect, useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  FileUpload,
  FileUploadItem,
  type FileUploadFile,
} from "@mof-malaysia/ftds-react/file-upload";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";

/**
 * ### Overview
 * `FileUpload` attaches documents to a form: a "Choose file" button, a drop
 * area, and a list of chosen files with size and a remove button. Files over
 * `maxSize` or outside `accept` stay in the list with an error. It wraps a
 * real `<input type="file">`, so it joins a `Field` and submits with a form.
 *
 * ### Usage
 * ```tsx
 * <Field name="documents">
 *   <FieldLabel>Supporting documents</FieldLabel>
 *   <FieldDescription>PDF or JPG, up to 5 MB each</FieldDescription>
 *   <FileUpload accept=".pdf,image/jpeg" multiple maxSize={5 * 1024 * 1024} />
 * </Field>
 * ```
 */
const meta: Meta<typeof FileUpload> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-fileupload",
  title: "App/FileUpload",
  component: FileUpload,
  parameters: { layout: "padded" },
};

export default meta;

const sample = (name: string, kb: number, type = "application/pdf") =>
  new File([new Uint8Array(kb * 1024)], name, { type });

const Basic = () => (
  <div className="max-w-xl">
    <Field name="documents">
      <FieldLabel>Supporting documents</FieldLabel>
      <FieldDescription>PDF or JPG, up to 5 MB each</FieldDescription>
      <FileUpload accept=".pdf,image/jpeg" multiple maxSize={5 * 1024 * 1024} />
    </Field>
  </div>
);
export const Default = createRender(Basic);

const WithFiles = () => (
  <div className="max-w-xl">
    <Field name="statements">
      <FieldLabel>Bank statements</FieldLabel>
      <FieldDescription>PDF only, up to 2 MB each</FieldDescription>
      <FileUpload
        accept=".pdf"
        multiple
        maxSize={2 * 1024 * 1024}
        defaultFiles={[
          { id: "a", file: sample("statement-january-2026.pdf", 340) },
          {
            id: "b",
            file: sample(
              "maybank-current-account-statement-february-2026-final-signed-copy.pdf",
              1180,
            ),
          },
          {
            id: "c",
            file: sample("scan-march.pdf", 4300),
            error: "scan-march.pdf is larger than 2 MB. Choose a smaller file.",
          },
        ]}
      />
    </Field>
  </div>
);
export const Uploaded = createRender(WithFiles);

const Progress = () => {
  const [files, setFiles] = useState<FileUploadFile[]>([
    { id: "p", file: sample("audited-accounts-2025.pdf", 2400), progress: 10 },
    {
      id: "u",
      file: sample("director-ic.jpg", 800, "image/jpeg"),
      uploading: true,
    },
  ]);
  useEffect(() => {
    const timer = setInterval(() => {
      setFiles((current) =>
        current.map((f) =>
          f.progress !== undefined && f.progress < 100
            ? { ...f, progress: Math.min(100, f.progress + 15) }
            : f,
        ),
      );
    }, 600);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="max-w-xl">
      <Field name="accounts">
        <FieldLabel>Audited accounts</FieldLabel>
        <FileUpload multiple files={files} onFilesChange={setFiles} />
      </Field>
    </div>
  );
};
export const Uploading = createRender(Progress);

const Invalid = () => (
  <div className="max-w-xl">
    <Field name="ic-copy" invalid>
      <FieldLabel>Copy of your IC</FieldLabel>
      <FieldDescription>JPG or PNG, front and back</FieldDescription>
      <FileUpload accept="image/jpeg,image/png" />
      <FieldError>Upload a copy of your IC</FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Disabled = () => (
  <div className="max-w-xl">
    <Field name="locked" disabled>
      <FieldLabel>Supporting documents</FieldLabel>
      <FileUpload
        disabled
        defaultFiles={[{ id: "d", file: sample("approval-letter.pdf", 210) }]}
      />
    </Field>
  </div>
);
export const DisabledState = createRender(Disabled);

const Previous = () => (
  <div className="flex max-w-xl flex-col gap-2">
    <h2 className="text-txt-black-900 m-0 text-base font-semibold">
      Previously uploaded
    </h2>
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      <FileUploadItem
        file={{ name: "ssm-certificate-2024.pdf", size: 512000 }}
      />
      <FileUploadItem
        file={{ name: "tax-clearance-letter.pdf", size: 98000 }}
      />
    </ul>
  </div>
);
export const PreviouslyUploaded = createRender(Previous);

const Compact = () => (
  <div data-density="compact">
    <WithFiles />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <WithFiles />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
