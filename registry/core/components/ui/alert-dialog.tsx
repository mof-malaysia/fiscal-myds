import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { InfoIcon } from "@/components/ui/icons/info";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { WarningDiamondIcon } from "@/components/ui/icons/warning-diamond";
import {
  ComponentProps,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  useContext,
} from "react";
import { clx } from "@/lib/ftds/utils";

const AlertDialogTrigger = DialogTrigger;
const AlertDialogTitle: typeof DialogTitle = DialogTitle;
const AlertDialogDescription: ForwardRefExoticComponent<
  ComponentProps<typeof DialogDescription>
> = forwardRef(({ children, className, ...props }, ref) => {
  return (
    <DialogDescription ref={ref} className={clx("pt-2", className)} {...props}>
      {children}
    </DialogDescription>
  );
});
const AlertDialogClose = DialogClose;

interface AlertDialogContextProps {
  variant: "default" | "success" | "info" | "warning" | "danger";
}

const AlertDialogContext = createContext<AlertDialogContextProps>({
  variant: "default",
});

interface AlertDialogProps
  extends ComponentProps<typeof Dialog>,
    Partial<AlertDialogContextProps> {}

const AlertDialog: FunctionComponent<AlertDialogProps> = ({
  variant = "default",
  ...props
}) => {
  return (
    <AlertDialogContext.Provider value={{ variant }}>
      <Dialog {...props} />
    </AlertDialogContext.Provider>
  );
};
interface AlertDialogActionProps
  extends Omit<ComponentProps<typeof DialogFooter>, "border"> {}

const AlertDialogAction: ForwardRefExoticComponent<AlertDialogActionProps> =
  forwardRef(({ children, className, ...props }, ref) => {
    return (
      <DialogFooter
        ref={ref}
        className={clx("px-0 pb-0", className)}
        {...props}
      >
        {children}
      </DialogFooter>
    );
  });

const AlertDialogContent: ForwardRefExoticComponent<
  ComponentProps<typeof DialogBody>
> = forwardRef(({ children, ...props }, ref) => {
  const { variant } = useContext(AlertDialogContext);

  const map = {
    default: {
      variant: "default",
      icon: <></>,
    },
    success: {
      variant: "success",
      icon: <CheckCircleIcon />,
    },
    info: {
      variant: "primary",
      icon: <InfoIcon />,
    },
    warning: {
      variant: "warning",
      icon: <WarningCircleIcon />,
    },
    danger: {
      variant: "danger",
      icon: <WarningDiamondIcon />,
    },
  } as const;

  return (
    <DialogBody ref={ref} {...props}>
      <DialogContent className="py-6">
        {/* The default variant has no icon */}
        {variant !== "default" && (
          <DialogIcon variant={map[variant].variant} className="mb-4">
            {map[variant].icon}
          </DialogIcon>
        )}
        <div>{children}</div>
      </DialogContent>
    </DialogBody>
  );
});

AlertDialog.displayName = "AlertDialog";
AlertDialogContent.displayName = "AlertDialogContent";
AlertDialogDescription.displayName = "AlertDialogDescription";
AlertDialogAction.displayName = "AlertDialogAction";
AlertDialogClose.displayName = "AlertDialogClose";
AlertDialogTitle.displayName = "AlertDialogTitle";
AlertDialogTrigger.displayName = "AlertDialogTrigger";

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogTitle,
  AlertDialogTrigger,
};
