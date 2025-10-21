import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure Stripe integration. Your payment information is always protected.",
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy on all products. Items must be in original condition with all packaging. Contact our support team to initiate a return.",
    },
    {
      question: "How can I contact support?",
      answer: "You can reach us at support@keebhouse.com and we'll respond within 24 hours. Our business hours are Monday-Friday 9am-6pm PST, Saturday 10am-4pm PST.",
    },
    {
      question: "Where are you located?",
      answer: "We're located at 123 Keyboard Lane, Tech District, San Francisco, CA 94102. Feel free to visit us during business hours.",
    },
    {
      question: "Do you sell authentic products?",
      answer: "Yes, absolutely. We partner with leading manufacturers and authorized sources to ensure all keyboards and components are genuine, high-quality products.",
    },
    {
      question: "What types of switches do you offer?",
      answer: "We offer a wide selection of premium mechanical switches including Cherry MX, Gateron, Kailh, and more. Choose from tactile, linear, or clicky switches to match your typing preference.",
    },
    {
      question: "Can I customize my keyboard?",
      answer: "Yes! We offer extensive customization options including different keyboard layouts, premium switches, and a wide selection of keycaps in various profiles, materials, and color schemes.",
    },
  ];

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Support
          </h2>
          <h3 className="text-4xl sm:text-5xl font-semibold text-foreground mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our products, shipping, and policies.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg bg-card px-6 data-[state=open]:bg-muted/50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-base font-medium text-foreground pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
