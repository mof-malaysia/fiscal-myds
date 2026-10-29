import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowBackIcon } from "@/components/ui/icons/arrow-back";
import { ArrowForwardIcon } from "@/components/ui/icons/arrow-forward";

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="default-outline" size="medium">
        <ButtonIcon>
          <ArrowBackIcon />
        </ButtonIcon>
        Go back
      </Button>
      <Button variant="default-outline" size="medium">
        Go forward
        <ButtonIcon>
          <ArrowForwardIcon />
        </ButtonIcon>
      </Button>
    </div>
  );
}
