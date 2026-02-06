import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Clock, Package } from "lucide-react";

const processSteps = [
  { step: 1, label: "Collection", status: "completed", icon: Package },
  { step: 2, label: "Sorting", status: "completed", icon: CheckCircle },
  { step: 3, label: "Processing", status: "active", icon: Clock },
  { step: 4, label: "Quality Check", status: "pending", icon: CheckCircle },
  { step: 5, label: "Dispatch", status: "pending", icon: ArrowRight },
];

export function RecyclingProcess() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Current Process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processSteps.map((step, index) => (
            <div key={step.step} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === "completed"
                    ? "bg-green-500 text-white"
                    : step.status === "active"
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground capitalize">{step.status}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className={`w-px h-8 ${step.status === "completed" ? "bg-green-500" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button className="w-full bg-primary hover:bg-primary/90">
            Start New Batch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
