import { Button, ButtonIcon } from "@/components/ui/button";
import { CopyIcon } from "@/components/ui/icons/copy";
import { TrashIcon } from "@/components/ui/icons/trash";
import { UploadIcon } from "@/components/ui/icons/upload";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="primary-fill" iconOnly aria-label="Upload">
        <ButtonIcon>
          <UploadIcon />
        </ButtonIcon>
      </Button>
      <Button variant="default-outline" iconOnly aria-label="Copy">
        <ButtonIcon>
          <CopyIcon />
        </ButtonIcon>
      </Button>
      <Button variant="danger-fill" iconOnly aria-label="Delete">
        <ButtonIcon>
          <TrashIcon />
        </ButtonIcon>
      </Button>
    </div>
  );
}
