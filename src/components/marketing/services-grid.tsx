import { services } from "@/data/site-content";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Cpu, HardDrive, Zap, Monitor, Wifi, Wrench, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Cpu,
  HardDrive,
  Zap,
  Monitor,
  Wifi,
  Wrench,
};

export function ServicesGrid() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-center mb-2">What We Fix</h2>
        <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
          From virus removal to hardware repair, we handle it all with full transparency.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Wrench;
            return (
              <Card key={service.title}>
                <CardContent className="pt-4">
                  <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
