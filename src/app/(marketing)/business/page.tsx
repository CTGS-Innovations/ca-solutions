import { PageHeading } from "@/components/shared/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { businessServices } from "@/data/site-content";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Building2 } from "lucide-react";

export default function BusinessPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <PageHeading
          title="Business Services"
          description="IT support designed for small and mid-size businesses. Priority service, fleet tracking, and flexible billing."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {businessServices.map((service) => (
            <Card key={service.title}>
              <CardContent className="pt-4">
                <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center mb-3">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                <p className="text-xs text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <CtaBanner />
    </>
  );
}
