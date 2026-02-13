import { processSteps } from "@/data/process-steps";

export function ProcessTimeline() {
  return (
    <section className="py-12 bg-card border-y">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-center mb-2">Our Process</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
          Every repair follows a structured, transparent process. No guesswork. No surprises.
        </p>
        <div className="max-w-2xl mx-auto space-y-0">
          {processSteps.map((step, idx) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </div>
                {idx < processSteps.length - 1 && (
                  <div className="w-0.5 h-16 bg-border my-1" />
                )}
              </div>
              <div className="pt-2 pb-6">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
