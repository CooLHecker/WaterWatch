import { Card } from "@/components/ui/Card";
import { ReportForm } from "@/components/report/ReportForm";

export function Report() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary">Report Waterlogging</h1>
        <p className="text-on-surface-variant mt-2">
          Help improve our models by reporting incidents in your area.
        </p>
      </header>
      <Card className="max-w-2xl">
        <ReportForm />
      </Card>
    </div>
  );
}
