import { 
  HelpCircle, 
  Phone, 
  BookOpen, 
  MessageCircle,
  ChevronRight,
  AlertTriangle,
  MapPin,
  Truck,
  Hospital,
  Shield
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface HelpSheetProps {
  trigger: React.ReactNode;
}

const HelpSheet = ({ trigger }: HelpSheetProps) => {
  const quickGuides = [
    {
      icon: AlertTriangle,
      title: "Receiving Dispatches",
      content: "When a new emergency is assigned, you'll receive an audio alert and the map will automatically display the route. Tap 'Accept' to confirm and begin navigation."
    },
    {
      icon: MapPin,
      title: "Navigation",
      content: "The map shows your current location as an ambulance icon. Follow the highlighted route. The ETA updates in real-time based on traffic conditions."
    },
    {
      icon: Truck,
      title: "Status Updates",
      content: "Use the large buttons at the bottom:\n• PICKUP PATIENT - Tap when you arrive at the patient location\n• DROP AT HOSPITAL - Tap when leaving for hospital\n• COMPLETE HANDOFF - Tap after patient transfer"
    },
    {
      icon: Hospital,
      title: "Hospital Communication",
      content: "The hospital receives automatic updates about your ETA. Patient vitals are shared in real-time. Use 'Call Hospital' for direct communication."
    },
    {
      icon: Shield,
      title: "Emergency Protocols",
      content: "In case of equipment failure or additional backup needed, use the 'Call Dispatch' button immediately. All calls are recorded for quality assurance."
    },
  ];

  const faqItems = [
    {
      question: "What if I lose GPS signal?",
      answer: "The app caches your route. Continue with the last known directions. Your location will update automatically when signal returns."
    },
    {
      question: "How do I report a road closure?",
      answer: "Tap the map and select 'Report Issue'. Choose 'Road Closure' and the system will calculate an alternate route and notify dispatch."
    },
    {
      question: "Can I reject a dispatch?",
      answer: "In emergency situations, rejections should be avoided. If you're unable to respond, immediately call dispatch to explain and request reassignment."
    },
    {
      question: "What happens if my app crashes?",
      answer: "Dispatch can still track your vehicle via GPS. Restart the app and your current case will be restored. Call dispatch if issues persist."
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent className="bg-card border-border/30 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Quick guides and emergency contacts
          </SheetDescription>
        </SheetHeader>

        {/* Emergency Contact */}
        <div className="mt-6 p-4 bg-status-critical/10 border border-status-critical/30 rounded-xl">
          <p className="text-sm font-semibold text-status-critical mb-2">24/7 Dispatch Hotline</p>
          <Button
            className="w-full bg-status-critical hover:bg-status-critical/90 text-primary-foreground"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call: 1-800-LIFELINK
          </Button>
        </div>

        {/* Quick Guides */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            Quick Guides
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {quickGuides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`guide-${index}`}
                  className="border border-border/30 rounded-xl px-4 bg-secondary/30"
                >
                  <AccordionTrigger className="hover:no-underline py-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-accent" />
                      <span className="text-sm font-medium text-foreground">{guide.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line pb-4">
                    {guide.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* FAQ */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-accent" />
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border border-border/30 rounded-xl px-4 bg-secondary/30"
              >
                <AccordionTrigger className="hover:no-underline py-3 text-left">
                  <span className="text-sm font-medium text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Report Issue Button */}
        <div className="mt-6 pb-6">
          <Button
            variant="outline"
            className="w-full justify-between h-12 border-border/30 text-foreground hover:bg-secondary/50"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              Report an Issue
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HelpSheet;
