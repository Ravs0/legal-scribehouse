import { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { CardHeader } from '@/components/site/CardHeader';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Button } from '@/components/ui/button';
import { HashLink } from '@/components/site/HashLink';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

// The "licensed" answer depends on the firm's regulatory status; confirm wording before launch.
const FAQS = [
  {
    q: 'Do I need a local company to export?',
    a: 'Usually not. Most small exporters start with a distributor or an importer of record. The right choice depends on your product and how much control you want, and the route plan sets out the trade-offs.',
  },
  {
    q: 'How long does product registration take?',
    a: 'Anywhere from weeks to many months, depending on the country and product category. We give you a realistic range in the route plan, before you commit.',
  },
  {
    q: 'Which trade agreement applies to me?',
    a: "It depends on where your goods are made and where they're going. We check the origin rules before you rely on a preferential rate.",
  },
  {
    q: 'Who should own the product registration and trademark?',
    a: "You, wherever local rules allow. Where they don't, the contract should say exactly what happens to them if the relationship ends.",
  },
  {
    q: 'Are you licensed in every ASEAN country?',
    a: 'We work with local counsel in each market. Local-law advice is given by, or together with, locally qualified practitioners.',
  },
  {
    q: 'What does it cost?',
    a: 'The first call is free. After it we quote a fixed fee for each job, in writing, before any work starts. There is no hourly billing, and local counsel is included in the quote where a market needs it.',
  },
];

export const Faq = () => {
  const [open, setOpen] = useState('');
  return (
  <section id="faq" className="section band">
    <div className="container">
      <SectionHeading index="10"
          eyebrow="FAQ" title="Questions we hear every week." />
      {/* v3.12: on the grid. Accordion in the right 8 columns; "Still unsure?" in the left 4, sticky, from 1024px. */}
      <div className="after-heading grid-12 items-start">
        <div className="col-span-4 md:col-span-12 lg:order-2 lg:col-span-8">
          <AccordionPrimitive.Root type="single" collapsible value={open} onValueChange={setOpen} className="space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q}>
              <AccordionPrimitive.Item value={`faq-${i}`} className="faq-item surface-1 card-hover overflow-hidden rounded-[12px]">
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="state-layer press-soft type-title-md group flex min-h-16 w-full items-center justify-between gap-4 py-4 pl-6 pr-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
                    {f.q}
                    <span
                      className={cn(
                        'btn-lift flex h-9 w-9 shrink-0 items-center justify-center rounded-full group-hover:-translate-y-px',
                        open === `faq-${i}` ? 'btn-filled bg-primary text-primary-foreground' : 'btn-raised bg-card text-foreground',
                      )}
                    >
                      <ChevronDown
                        className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="faq-content overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="type-body-md max-w-[64ch] px-6 pb-6 pr-16 text-muted-foreground">{f.a}</p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
              </Reveal>
            ))}
          </AccordionPrimitive.Root>
        </div>
          <Reveal className="col-span-4 mt-2 md:col-span-12 lg:sticky lg:top-24 lg:order-1 lg:col-span-4 lg:mt-0">
            <div className="surface-2 card-shell card-shell-lg rounded-[12px]">
              <div className="min-w-0 flex-1">
                <CardHeader icon={MessageCircleQuestion} title="Still unsure?" />
                <p className="card-body type-body-md text-muted-foreground">Most first-shipment questions get answered in a free 30-minute call. Bring the product, the market and any paperwork you already have.</p>
              </div>
              <Button asChild icon="trailing" className="mt-5 self-start">
                <HashLink to="contact">
                  Book a free call <ArrowRight aria-hidden="true" />
                </HashLink>
              </Button>
            </div>
          </Reveal>
      </div>
    </div>
  </section>
);
};
