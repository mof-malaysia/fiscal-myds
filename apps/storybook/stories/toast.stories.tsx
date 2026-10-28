import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { createStory } from "../utils";
import { AutoToast } from "@mof-malaysia/myds-react/toast";
import { useToast } from "@mof-malaysia/myds-react/hooks";
import { Button } from "@mof-malaysia/myds-react/button";
import React from "react";

const DemoToast = (props: any) => {
  const { toast } = useToast();

  return (
    <div className="flex h-screen w-full items-center justify-center gap-1">
      <Button
        variant={"default-outline"}
        onClick={() => {
          toast({
            variant: "message",
            title: "Hello, world!",
            description: "this is a description",
          });
        }}
      >
        Message
      </Button>
      <Button
        variant={"default-outline"}
        onClick={() => {
          toast({
            variant: "info",
            title: "Quick info toast",
            description: "this is a description",
          });
        }}
      >
        Info
      </Button>
      <Button
        variant={"default-outline"}
        onClick={() => {
          toast({
            variant: "success",
            title: "Success",
            description: "this is a description",
          });
        }}
      >
        Success
      </Button>
      <Button
        variant={"default-outline"}
        onClick={() => {
          toast({
            variant: "warning",
            title: "Warning",
            description: "this is a description",
          });
        }}
      >
        Warning
      </Button>
      <Button
        variant={"default-outline"}
        onClick={() => {
          toast({
            variant: "error",
            title: "Error",
            description: "this is a description",
          });
        }}
      >
        Error
      </Button>

      <AutoToast {...props} />
    </div>
  );
};

/**
 * ### Overview
 *
 * This file contains the implementation of a Toast component using `@mof-malaysia/myds-react/toast`.
 * The `DemoToast` component demonstrates various toast notifications such as message, info, success, warning, and error.
 *
 * > Toast enak dimakan pagi,
 * > Hangat terasa di dalam hati.
 * > Komponen Toast ini serbaguna sekali,
 * > Memberi notifikasi dengan cepat dan rapi. -- ChatGPT
 *
 *
 * ### Usage
 * ```tsx
 * import { AutoToast } from "@mof-malaysia/myds-react/toast";
 * import { useToast } from "@mof-malaysia/myds-react/hooks";
 *
 * const { toast } = useToast();
 *
 * <button
 *  onClick={() => {
 *    toast({ variant: "message", title: "Hello, world!", description: "this is a description" });
 *  }}>
 *    Message
 * </button>
 *
 * //* Simple usage
 * <AutoToast />
 *
 * //* Advanced usage (manual composition with Base UI's toast manager)
 * import {
 *   ToastProvider,
 *   ToastViewport,
 *   ToastRoot,
 *   ToastIcon,
 *   ToastTitle,
 *   ToastDescription,
 *   ToastClose,
 *   ToastProgress,
 *   useToastManager,
 * } from "@mof-malaysia/myds-react/toast";
 *
 * const ToastList = () => {
 *   // Must be rendered inside <ToastProvider>
 *   const { toasts } = useToastManager();
 *
 *   return toasts.map((toast) => (
 *     <ToastRoot key={toast.id} toast={toast}>
 *       <ToastIcon />
 *       <div className="space-y-1">
 *         <ToastTitle />
 *         {toast.description && <ToastDescription />}
 *       </div>
 *       <ToastClose />
 *       <ToastProgress />
 *     </ToastRoot>
 *   ));
 * };
 *
 * const AddToastButton = () => {
 *   const toastManager = useToastManager();
 *   return (
 *     <button
 *       onClick={() =>
 *         toastManager.add({ type: "success", title: "Saved", description: "All changes saved" })
 *       }
 *     >
 *       Save
 *     </button>
 *   );
 * };
 *
 * return (
 *   <ToastProvider timeout={5000} limit={3}>
 *     <AddToastButton />
 *     <ToastViewport>
 *       <ToastList />
 *     </ToastViewport>
 *   </ToastProvider>
 * );
 * ```
 */
const meta = {
  title: "@mof-malaysia/myds-react/Toast",
  component: DemoToast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",

    docs: {
      story: {
        inline: false,
        height: "500px",
      },
    },
  },

  argTypes: {
    duration: {
      table: {
        type: {
          summary: "5000",
        },
      },
      description: "Time (ms) before toast disappears",
      control: { type: "range", min: 1000, max: 10000, step: 1000 },
      type: "number",
    },
  },
} satisfies Meta<typeof AutoToast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Storybook stories for different variants of a component.
 *
 * @example
 * export const Default: Story = createStory({ ... });
 * export const DarkDefault: Story = createStory({ ... }, "dark");
 */

export const Default: Story = createStory({
  duration: 5000,
});
export const DefaultDark: Story = createStory({ className: "dark" }, "dark");
