import { Panel } from "@/components/ui/panel";
import { MapPin, Clock, CreditCard, Phone } from "lucide-react";
import { contactInfo } from "@/data/site-content";

export function PickupInstructions() {
  return (
    <Panel title="Pickup Instructions" icon={MapPin}>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Hours</p>
            {contactInfo.hours.map((h) => (
              <p key={h.day} className="text-muted-foreground">
                {h.day}: {h.time}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{contactInfo.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Payment Methods</p>
            <p className="text-muted-foreground">{contactInfo.paymentMethods.join(", ")}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Questions?</p>
            <p className="text-muted-foreground">Call us at {contactInfo.phone}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
