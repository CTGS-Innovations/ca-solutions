import { contactInfo } from "@/data/site-content";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, CreditCard } from "lucide-react";

export function ContactInfoSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Business Hours</h3>
          </div>
          <div className="space-y-1 text-sm">
            {contactInfo.hours.map((h) => (
              <div key={h.day} className="flex justify-between">
                <span className="text-muted-foreground">{h.day}</span>
                <span>{h.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Location</h3>
          </div>
          <p className="text-sm">{contactInfo.address}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Contact</h3>
          </div>
          <div className="space-y-1 text-sm">
            <p>{contactInfo.phone}</p>
            <p className="text-muted-foreground">{contactInfo.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">Payment Methods</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {contactInfo.paymentMethods.map((method) => (
              <span
                key={method}
                className="px-2 py-0.5 bg-muted rounded text-xs"
              >
                {method}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
