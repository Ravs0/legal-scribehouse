import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal } from '@/components/motion/Reveal';
import { SectionLabel } from '@/components/site/SectionLabel';

// The "licensed" answer depends on the firm's regulatory status; confirm the wording before launch.
const FAQS = [
  {
    q: 'Do I need a local company to export?',
    a: 'Usually not. Many exporters start with a distributor or an importer of record. It depends on the product and how much control you want, and we lay out the trade-offs in plain terms.',
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
    a: 'The first call is free. After that, work is scoped to a fixed fee wherever possible, so you know the number before we start.',
  },
];

export const Faq = () => (
  <section id="faq" className="scroll-mt-20 py-20 md:py-28">
    <div className="container grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <SectionLabel index="09" label="QUESTIONS" />
        <Reveal>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Fair <em className="font-medium text-accent">questions</em>.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">The things most first-time exporters ask us.</p>
        </Reveal>
      </div>
      <Reveal className="lg:col-span-8">
        <Accordion type="single" collapsible className="border-t border-border">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="gap-4 py-5 text-left font-display text-lg font-semibold hover:no-underline md:text-xl">
                <span className="flex gap-4">
                  <span aria-hidden="true" className="pt-1 font-mono text-xs font-normal text-accent">
                    Q{String(i + 1).padStart(2, '0')}
                  </span>
                  {f.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-11 text-base text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
);
