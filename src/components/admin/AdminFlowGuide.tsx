import { Card } from "@/components/ui/Card";
import { Info } from "lucide-react";

type AdminFlowGuideProps = {
  title: string;
  steps: string[];
};

export function AdminFlowGuide({ title, steps }: AdminFlowGuideProps) {
  return (
    <Card padding="md" className="mb-6 border-brand-green/20 bg-brand-green/5">
      <div className="flex gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <ol className="mt-2 list-decimal space-y-1 ps-4 text-sm text-muted-foreground">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
}
