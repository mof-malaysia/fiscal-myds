import { Button } from "@/components/ui/button";

export default function ButtonState() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="primary-fill">Default</Button>
      <Button variant="primary-fill" disabled>
        Disabled
      </Button>
      <Button variant="default-outline">Default</Button>
      <Button variant="default-outline" disabled>
        Disabled
      </Button>
    </div>
  );
}
