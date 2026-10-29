import { Button, ButtonCounter } from "@/components/ui/button";

export default function ButtonWithCounter() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="primary-fill" size="medium">
        Filter
        <ButtonCounter>5</ButtonCounter>
      </Button>
      <Button variant="default-outline" size="medium">
        Filter
        <ButtonCounter>5</ButtonCounter>
      </Button>
      <Button variant="danger-fill" size="medium">
        Filter
        <ButtonCounter>5</ButtonCounter>
      </Button>
    </div>
  );
}
