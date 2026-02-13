import { trustIndicators } from "@/data/site-content";

export function TrustIndicators() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {trustIndicators.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-primary">{item.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
