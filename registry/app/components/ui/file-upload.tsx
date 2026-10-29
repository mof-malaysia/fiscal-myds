"use client";

import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Progress, ProgressTrack } from "@/components/ui/progress";
import { UploadIcon } from "@/components/ui/icons/upload";
import { DocumentIcon } from "@/components/ui/icons/document";
import { CrossIcon } from "@/components/ui/icons/cross";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { useControllableState, useMergedRefs } from "@/lib/ftds/hooks";
import { clx } from "@/lib/ftds/utils";

/**
 * FileUpload lets users attach documents to a form: a "Choose file" button and a
 * drop area, then a list of the chosen files with their size and a remove
 * button. Files over `maxSize` or outside `accept` stay in the list with an
 * error, so users see which file was rejected and why.
 *
 * It wraps a real `<input type="file">`, so it joins a surrounding Field (label,
 * hint, error) and submits with a native form. Upload progress is up to you:
 * set `progress` or `uploading` on a file in a controlled `files` list.
 *
 * @example
 * <Field name="documents">
 *   <FieldLabel>Supporting documents</FieldLabel>
 *   <FieldDescription>PDF or JPG, up to 5 MB each</FieldDescription>
 *   <FileUpload accept=".pdf,image/jpeg" multiple maxSize={5 * 1024 * 1024} />
 * </Field>
 */

/*========================================================================================================================*/

interface FileUploadFile {
  /** Stable key for the list. */
  id: string;
  file: File;
  /** Shown under the file in Danger. Files with an error are not submitted. */
  error?: ReactNode;
  /** Upload progress, 0–100. Shows a progress bar while below 100. */
  progress?: number;
  /** Shows a spinner and "Uploading…" in place of the file name. */
  uploading?: boolean;
}

let idCounter = 0;
const createId = () =>
  `file-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

/** Bytes as a short human-readable size: 512 B, 1.2 KB, 4.8 MB. */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${size < 10 ? size.toFixed(1).replace(/\.0$/, "") : Math.round(size)} ${units[unit]}`;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

/*========================================================================================================================*/

interface FileUploadItemProps {
  file: File | { name: string; size?: number };
  error?: ReactNode;
  progress?: number;
  uploading?: boolean;
  disabled?: boolean;
  /** Called by the remove button. Omit to hide it (e.g. a previously uploaded file). */
  onRemove?: () => void;
  /** Accessible name of the remove button. */
  removeLabel?: string;
  /** Replaces the file name while uploading. */
  uploadingLabel?: ReactNode;
  className?: string;
}

/**
 * One file in the list. Exported so you can show previously uploaded files
 * the same way.
 */
const FileUploadItem = forwardRef<HTMLLIElement, FileUploadItemProps>(
  (
    {
      file,
      error,
      progress,
      uploading = false,
      disabled = false,
      onRemove,
      removeLabel,
      uploadingLabel = "Uploading…",
      className,
    },
    ref,
  ) => {
    const dot = file.name.lastIndexOf(".");
    const base = dot > 0 ? file.name.slice(0, dot) : file.name;
    const ext = dot > 0 ? file.name.slice(dot) : "";
    const showProgress = progress !== undefined && progress < 100 && !error;
    const busy = uploading || showProgress;

    return (
      <li
        ref={ref}
        aria-busy={busy || undefined}
        className={clx(
          "font-body flex flex-col gap-2 rounded-md px-3 py-2.5",
          error ? "bg-bg-danger-50" : "bg-bg-washed",
          disabled && "text-txt-black-500",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {uploading ? (
            <Spinner size="medium" className="shrink-0" label={null} />
          ) : (
            <DocumentIcon
              aria-hidden
              className={clx(
                "size-5 shrink-0",
                error ? "text-txt-danger" : "text-txt-black-700",
              )}
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            {uploading ? (
              <span className="text-content text-txt-black-700">
                {uploadingLabel}
              </span>
            ) : (
              // Keep the extension visible when a long name is truncated
              <span
                className={clx(
                  "text-content flex min-w-0 font-medium",
                  disabled ? "text-txt-black-500" : "text-txt-black-900",
                )}
                title={file.name}
              >
                <span className="truncate">{base}</span>
                <span className="shrink-0">{ext}</span>
              </span>
            )}
            {file.size !== undefined && !uploading && (
              <span className="text-txt-black-700 text-label-sm tabular-nums">
                {formatFileSize(file.size)}
              </span>
            )}
          </div>
          {onRemove && (
            <Button
              type="button"
              variant="default-ghost"
              size="small"
              iconOnly
              disabled={disabled}
              aria-label={removeLabel ?? `Remove ${file.name}`}
              onClick={onRemove}
              className="shrink-0"
            >
              <CrossIcon aria-hidden className="size-4" />
            </Button>
          )}
        </div>
        {showProgress && (
          <Progress
            value={Math.max(0, Math.min(100, progress))}
            aria-label={`Uploading ${file.name}`}
          >
            <ProgressTrack className="h-1" />
          </Progress>
        )}
        {error && (
          <p className="text-txt-danger text-content m-0 flex items-start gap-1.5 font-medium">
            <WarningCircleIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </li>
    );
  },
);
FileUploadItem.displayName = "FileUploadItem";

/*========================================================================================================================*/

interface FileUploadProps {
  /** Controlled list of files. */
  files?: FileUploadFile[];
  /** Initial files (uncontrolled). */
  defaultFiles?: FileUploadFile[];
  onFilesChange?: (files: FileUploadFile[]) => void;
  /** Same as the native attribute: ".pdf,image/*". Files that don't match get an error. */
  accept?: string;
  /** Allow more than one file. Without it, a new choice replaces the current file. */
  multiple?: boolean;
  /** Largest file allowed, in bytes. Larger files get an error. */
  maxSize?: number;
  /** Error for a file over `maxSize`. */
  maxSizeMessage?: (file: File, maxSize: number) => ReactNode;
  /** Error for a file outside `accept`. */
  acceptMessage?: (file: File, accept: string) => ReactNode;
  disabled?: boolean;
  /** Form field name. Taken from the surrounding Field when there is one. */
  name?: string;
  id?: string;
  /** Button text. Defaults to "Choose file" or "Choose files". */
  buttonLabel?: ReactNode;
  /** Text beside the button. Defaults to "or drop file here". */
  dropLabel?: ReactNode;
  /** Accessible name of each remove button. Defaults to "Remove {file name}". */
  removeLabel?: (file: File) => string;
  /** Replaces a file's name while it uploads. */
  uploadingLabel?: ReactNode;
  className?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      files: filesProp,
      defaultFiles = [],
      onFilesChange,
      accept,
      multiple = false,
      maxSize,
      maxSizeMessage = (file, max) =>
        `${file.name} is larger than ${formatFileSize(max)}. Choose a smaller file.`,
      acceptMessage = (file) =>
        `${file.name} is not a file type we accept. Choose a different file.`,
      disabled = false,
      name,
      id,
      buttonLabel,
      dropLabel,
      removeLabel,
      uploadingLabel,
      className,
    },
    forwardedRef,
  ) => {
    const [files = [], setFiles] = useControllableState<FileUploadFile[]>({
      prop: filesProp,
      defaultProp: defaultFiles,
      onChange: onFilesChange,
    });
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setRefs = useMergedRefs(inputRef, forwardedRef);

    // Keep the native input's FileList in step, so a plain form submits the valid files.
    // Keyed on the valid ids, so progress updates don't rebuild it.
    const validIds = files
      .filter((f) => !f.error)
      .map((f) => f.id)
      .join(" ");
    const validFiles = useMemo(
      () => files.filter((f) => !f.error).map((f) => f.file),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [validIds],
    );
    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      try {
        const transfer = new DataTransfer();
        validFiles.forEach((file) => transfer.items.add(file));
        input.files = transfer.files;
      } catch {
        // DataTransfer isn't constructible in some older browsers; only clear
        if (validFiles.length === 0) input.value = "";
      }
    }, [validFiles]);

    const addFiles = (list: FileList | File[]) => {
      const incoming = Array.from(list).map<FileUploadFile>((file) => ({
        id: createId(),
        file,
        error:
          accept && !matchesAccept(file, accept)
            ? acceptMessage(file, accept)
            : maxSize !== undefined && file.size > maxSize
              ? maxSizeMessage(file, maxSize)
              : undefined,
      }));
      if (incoming.length === 0) return;
      setFiles(multiple ? [...files, ...incoming] : incoming.slice(0, 1));
    };

    const removeFile = (fileId: string) => {
      setFiles(files.filter((f) => f.id !== fileId));
      // The remove button unmounts; keep focus in the control
      inputRef.current?.focus();
    };

    return (
      <div className={clx("font-body flex w-full flex-col gap-3", className)}>
        <div
          data-dragging={dragging || undefined}
          data-disabled={disabled || undefined}
          onDragEnter={(event) => {
            if (disabled) return;
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            if (disabled) return;
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setDragging(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (disabled) return;
            addFiles(event.dataTransfer.files);
          }}
          className={clx(
            "bg-bg-washed flex flex-wrap items-center gap-3 rounded-lg border-2 border-dashed border-transparent p-4",
            "in-data-[density=compact]:gap-2 in-data-[density=compact]:p-3",
            "ease-standard transition-colors duration-150 motion-reduce:transition-none",
            // Drag-over: the drop target lights up (a state, not decoration)
            "data-[dragging]:border-otl-primary-300 data-[dragging]:bg-bg-primary-50",
            // Inside an invalid Field
            "has-[input[data-invalid]]:border-bg-danger-600",
            // The hidden input owns focus; show the ring on the zone
            "has-[input:focus-visible]:outline-fr-primary has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-solid",
            "data-[disabled]:cursor-not-allowed",
          )}
        >
          {/* The real control: labelled and described by the Field, submitted with the form */}
          <FieldPrimitive.Control
            ref={setRefs}
            id={id}
            name={name}
            disabled={disabled}
            render={
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                className="sr-only"
                onChange={(event) => {
                  const list = event.currentTarget.files;
                  if (list && list.length) addFiles(list);
                }}
              />
            }
          />
          {/* Mouse users click this; keyboard and screen reader users use the input above */}
          <Button
            type="button"
            variant="primary-outline"
            size="small"
            tabIndex={-1}
            aria-hidden
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon aria-hidden className="size-4" />
            {buttonLabel ?? (multiple ? "Choose files" : "Choose file")}
          </Button>
          <span
            aria-hidden
            className={clx(
              "text-content",
              // Ink Tertiary when disabled (DESIGN.md: Inputs, Disabled)
              disabled ? "text-txt-black-500" : "text-txt-black-700",
            )}
          >
            {dropLabel ??
              (multiple ? "or drop files here" : "or drop file here")}
          </span>
        </div>

        {files.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {files.map((item) => (
              <FileUploadItem
                key={item.id}
                file={item.file}
                error={item.error}
                progress={item.progress}
                uploading={item.uploading}
                disabled={disabled}
                removeLabel={removeLabel?.(item.file)}
                uploadingLabel={uploadingLabel}
                onRemove={() => removeFile(item.id)}
              />
            ))}
          </ul>
        )}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";

export { FileUpload, FileUploadItem, formatFileSize };
export type { FileUploadProps, FileUploadItemProps, FileUploadFile };
