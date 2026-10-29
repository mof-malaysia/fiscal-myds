import { Button } from "@/components/ui/button";

export default function ButtonVariant() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="primary-fill">Primary</Button>
        <Button variant="default-outline">Secondary</Button>
        <Button variant="primary-outline">Secondary colour</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="default-ghost">Tertiary</Button>
        <Button variant="primary-ghost">Tertiary colour</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="danger-fill">Danger primary</Button>
        <Button variant="danger-outline">Danger secondary</Button>
        <Button variant="danger-ghost">Danger tertiary</Button>
      </div>
    </div>
  );
}
