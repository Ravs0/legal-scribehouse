import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Stamp } from '@/components/motion/Stamp';
import { SectionLabel } from '@/components/site/SectionLabel';
import { SITE } from '@/config/site';
import { MARKETS } from '@/data/markets';
import { submitEnquiry, type Enquiry } from '@/lib/enquiry';
import { useEnquiryDraft } from '@/stores/enquiryDraft';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Food & beverage',
  'Cosmetics & personal care',
  'Medical devices',
  'Consumer goods',
  'Industrial',
  'Other',
];
const STAGES = ['Exploring', 'Have a buyer', 'Already shipping', 'Have a problem'];
const MARKET_CHOICES = [...MARKETS.map((m) => m.code), 'Not sure'];

const schema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  company: z.string().trim().optional(),
  origin: z.string().trim().optional(),
  markets: z.array(z.string()),
  category: z.string().optional(),
  stage: z.string().optional(),
  message: z.string().trim().min(10, 'A sentence or two helps us prepare (10+ characters).'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm to continue.' }) }),
  website: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full border border-input bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary';

const FieldLabel = ({ n, htmlFor, children, required }: { n: string; htmlFor?: string; children: React.ReactNode; required?: boolean }) => (
  <label htmlFor={htmlFor} className="label-mono mb-2 block text-muted-foreground">
    <span className="text-accent">{n}</span> / {children}
    {required && <span className="text-accent"> *</span>}
  </label>
);

const ErrorText = ({ id, msg }: { id: string; msg?: string }) =>
  msg ? (
    <p id={id} className="mt-1.5 font-mono text-xs text-destructive">
      {msg}
    </p>
  ) : null;

export const Contact = () => {
  const [sent, setSent] = useState(false);
  const draft = useEnquiryDraft();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { markets: [], message: '', website: '' },
  });

  // Prefill from the readiness check.
  useEffect(() => {
    if (draft.nonce > 0) {
      setValue('message', draft.message);
      setSent(false);
    }
  }, [draft.nonce, draft.message, setValue]);

  const markets = watch('markets');
  const toggleMarket = (code: string) =>
    setValue('markets', markets.includes(code) ? markets.filter((m) => m !== code) : [...markets, code]);

  const onSubmit = async (values: FormValues) => {
    if (values.website) return; // bot
    await submitEnquiry(values as Enquiry);
    setSent(true);
    toast.success('Enquiry ready to send', {
      description: `Your email app should have opened with the details. If not, write to ${SITE.email}.`,
    });
  };

  const a11y = (name: keyof FormValues) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <section id="contact" className="scroll-mt-16 bg-primary py-20 text-primary-foreground md:py-28">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="10" label="CONSULTATION" inverse />
          <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Tell us what you're <em className="font-medium">shipping</em>.
          </h2>
          {/* Placeholder commitment: confirm the response time before launch. */}
          <p className="mt-4 text-lg text-primary-foreground/80">
            The first 30-minute call is free. We reply within two working days.
          </p>

          <dl className="mt-10 space-y-4 font-mono text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-primary-foreground/60">Email</dt>
              <dd>
                <a href={`mailto:${SITE.email}`} className="underline decoration-dashed underline-offset-4">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.12em] text-primary-foreground/60">Desk</dt>
              <dd>{SITE.city}</dd>
            </div>
          </dl>

          <pre aria-hidden="true" className="mt-10 hidden select-none font-mono text-xs leading-tight text-primary-foreground/50 lg:block">
{`  WHAT HAPPENS NEXT
  -----------------
  01  We read your note
  02  We book a 30-min call
  03  You get a written route plan
      with a fixed fee`}
          </pre>
        </div>

        <div className="lg:col-span-7">
          <div className="relative border border-border bg-background p-5 text-foreground md:p-8">
            <div className="label-mono mb-6 flex items-center justify-between border-b border-dashed border-rule pb-3 text-muted-foreground">
              <span>Consignment note · Enquiry</span>
              <span aria-hidden="true">No. ____</span>
            </div>

            {sent ? (
              <div className="py-6 duration-300 animate-in fade-in" role="status">
                <Stamp sub={new Date().toLocaleDateString()} className="text-2xl">
                  Received
                </Stamp>
                <p className="mt-8 font-display text-2xl font-semibold">Thanks, your enquiry is on its way.</p>
                <p className="mt-2 text-muted-foreground">
                  Your email app should have opened with everything filled in. Hit send there and we'll reply within
                  two working days. Nothing opened? Write to{' '}
                  <a className="text-primary underline" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                  .
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 rounded-sm font-mono"
                  onClick={() => {
                    reset();
                    setSent(false);
                  }}
                >
                  New enquiry
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel n="01" htmlFor="enquiry-name" required>
                    Name
                  </FieldLabel>
                  <input id="enquiry-name" autoComplete="name" className={inputClass} {...register('name')} {...a11y('name')} />
                  <ErrorText id="name-error" msg={errors.name?.message} />
                </div>
                <div>
                  <FieldLabel n="02" htmlFor="enquiry-email" required>
                    Work email
                  </FieldLabel>
                  <input
                    id="enquiry-email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    {...register('email')}
                    {...a11y('email')}
                  />
                  <ErrorText id="email-error" msg={errors.email?.message} />
                </div>
                <div>
                  <FieldLabel n="03" htmlFor="enquiry-company">
                    Company
                  </FieldLabel>
                  <input id="enquiry-company" autoComplete="organization" className={inputClass} {...register('company')} />
                </div>
                <div>
                  <FieldLabel n="04" htmlFor="enquiry-origin">
                    Exporting from
                  </FieldLabel>
                  <input
                    id="enquiry-origin"
                    autoComplete="country-name"
                    placeholder="Country"
                    className={inputClass}
                    {...register('origin')}
                  />
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className="label-mono mb-2 text-muted-foreground">
                    <span className="text-accent">05</span> / Target markets
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {MARKET_CHOICES.map((code) => {
                      const on = markets.includes(code);
                      return (
                        <button
                          key={code}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleMarket(code)}
                          className={cn(
                            'border px-2.5 py-1 font-mono text-sm transition-colors',
                            on
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background hover:border-primary',
                          )}
                        >
                          {code}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <FieldLabel n="06" htmlFor="enquiry-category">
                    Product category
                  </FieldLabel>
                  <select id="enquiry-category" className={inputClass} defaultValue="" {...register('category')}>
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel n="07" htmlFor="enquiry-stage">
                    Stage
                  </FieldLabel>
                  <select id="enquiry-stage" className={inputClass} defaultValue="" {...register('stage')}>
                    <option value="">Select…</option>
                    {STAGES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel n="08" htmlFor="enquiry-message" required>
                    What are you shipping, and where?
                  </FieldLabel>
                  <textarea
                    id="enquiry-message"
                    rows={5}
                    className={cn(inputClass, 'resize-y')}
                    {...register('message')}
                    {...a11y('message')}
                  />
                  <ErrorText id="message-error" msg={errors.message?.message} />
                </div>

                {/* Honeypot: hidden from people, tempting to bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="enquiry-website">Website</label>
                  <input id="enquiry-website" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
                      {...register('consent')}
                      {...a11y('consent')}
                    />
                    <span>I understand this enquiry doesn't create an adviser–client relationship.</span>
                  </label>
                  <ErrorText id="consent-error" msg={errors.consent?.message} />
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" size="lg" disabled={isSubmitting} className="arrow-nudge h-12 rounded-sm px-6 text-base">
                    Send enquiry <span className="arrow ml-1 font-mono">-&gt;</span>
                  </Button>
                  <span className="font-mono text-xs text-muted-foreground">* required</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
