/**
 * Samples for the best-practice pairs. They render to static HTML (no client
 * directive), so they cost no JavaScript.
 */
import { Button, ButtonIcon } from "@/components/ui/button";
import { SettingIcon } from "@/components/ui/icons/setting";
import { TrashIcon } from "@/components/ui/icons/trash";
import { UploadIcon } from "@/components/ui/icons/upload";

export const OnePrimaryDo = () => (
  <>
    <Button variant="default-outline">Back</Button>
    <Button variant="primary-fill">Continue</Button>
  </>
);

export const OnePrimaryDont = () => (
  <>
    <Button variant="primary-fill">Save draft</Button>
    <Button variant="primary-fill">Submit</Button>
  </>
);

export const LabelDo = () => (
  <Button variant="primary-fill">
    Pay <span className="tabular-nums">RM 120.00</span>
  </Button>
);

export const LabelDont = () => <Button variant="primary-fill">OK</Button>;

export const CaseDo = () => (
  <Button variant="primary-fill">Submit application</Button>
);

export const CaseDont = () => (
  <Button variant="primary-fill">SUBMIT APPLICATION</Button>
);

export const DangerDo = () => (
  <>
    <Button variant="default-outline">Keep record</Button>
    <Button variant="danger-fill">Delete record</Button>
  </>
);

export const DangerDont = () => (
  <Button variant="danger-fill">Clear filters</Button>
);

export const IconOnlyDo = () => (
  <>
    <Button variant="primary-fill">
      <ButtonIcon>
        <UploadIcon />
      </ButtonIcon>
      Upload file
    </Button>
    <Button variant="default-ghost" iconOnly aria-label="Delete file">
      <ButtonIcon>
        <TrashIcon />
      </ButtonIcon>
    </Button>
  </>
);

export const IconOnlyDont = () => (
  <Button variant="primary-fill" iconOnly aria-label="Submit">
    <ButtonIcon>
      <SettingIcon />
    </ButtonIcon>
  </Button>
);
