import { Button, ButtonCounter, ButtonIcon } from "@/components/ui/button";
import { FilterIcon } from "@/components/ui/icons/filter";

/** Static anatomy sample: `data-part` marks each numbered part. */
export default function ButtonAnatomy() {
  return (
    <Button variant="primary-fill" size="large" data-part="1">
      <span data-part="2" className="inline-flex">
        <ButtonIcon>
          <FilterIcon />
        </ButtonIcon>
      </span>
      <span data-part="3">Filter</span>
      <span data-part="4" className="inline-flex">
        <ButtonCounter>5</ButtonCounter>
      </span>
    </Button>
  );
}
