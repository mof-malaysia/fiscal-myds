import { Button } from "@/components/ui/button";

export default function ButtonSize() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="default-outline" size="small">
        Small
      </Button>
      <Button variant="default-outline" size="medium">
        Medium
      </Button>
      <Button variant="default-outline" size="large">
        Large
      </Button>
    </div>
  );
}
