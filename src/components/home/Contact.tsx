import { ReactNode, useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AlertCircle, Check, Loader2, Mail, MapPin, Phone, Send, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterChip, IconContainer } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { SITE } from '@/config/site';
import { MARKETS } from '@/data/markets';
import { submitEnquiry, type Enquiry } from '@/lib/enquiry';
import { useEnquiryDraft } from '@/stores/enquiryDraft';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Food & beverage', 'Cosmetics & personal care', 'Medical devices', 'Consumer goods', 'Industrial', 'Other'];
const STAGES = ['Exploring', 'Have a buyer', 'Already shipping', 'Have a problem'];
const MARKET_CHOICES = [...MARKETS.map((m) => m.name), 'Not sure yet'];

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

/** Static label above, control, then helper or error text 6px below. */
const Field = ({
  label,
  htmlFor,
  required,
  error,
  errorId,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="type-label-md mb-2 block text-foreground">
      {label}
      {required && <span className="text-destructive"> *</span>}
    </label>
    {children}
    {error && (
      <p id={errorId} className="type-body-sm mt-1.5 flex items-center gap-1.5 text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

const NEXT_STEPS = ['We read your note and check fit', 'We book a free 30-minute call', 'You get a written route plan with a fixed fee'];

export const Contact = () => {
  const [sent, setSent] = useState(false);
  const draft = useEnquiryDraft();
  const consentId = useId();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { markets: [], message: '', website: '' },
  });

  useEffect(() => {
    if (draft.nonce > 0) {
      setValue('message', draft.message);
      setSent(false);
    }
  }, [draft.nonce, draft.message, setValue]);

  const markets = watch('markets');
  const toggleMarket = (m: string) =>
    setValue('markets', markets.includes(m) ? markets.filter((x) => x !== m) : [...markets, m]);

  const onSubmit = async (values: FormValues) => {
    if (values.website) return;
    await submitEnquiry(values as Enquiry);
    setSent(true);
    toast.success('Enquiry ready to send', {
      description: `Your email app should have opened. If not, write to ${SITE.email}.`,
    });
  };

  const a11y = (name: keyof FormValues) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const contactRows = [
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Office', value: SITE.city },
  ];

  return (
    <section id="contact" data-stage="contact" className="section">
      <div className="container">
        <div className="grid-12 items-start gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-5">
            {/* Confirm the response-time promise with the firm before launch. */}
            <SectionHeading
              eyebrow="Book a consult"
              title="Tell us what you're shipping, and where."
              subtitle="We reply within one business day with next steps."
            />
            <Reveal className="mt-10 hidden space-y-6 lg:block">
              <ContactDetails rows={contactRows} />
              <NextSteps />
            </Reveal>
          </div>

          <Reveal className="col-span-4 md:col-span-12 lg:col-span-7">
            <div className="glass liquid-sheen glass-tall panel-pad rounded-xl">
              {sent ? (
                <div role="status" className="flex animate-step-in flex-col items-start py-4">
                  <IconContainer icon={Check} tone="success" className="h-14 w-14" />
                  <p className="type-headline-sm mt-6">Thanks, we've got it.</p>
                  <p className="type-body-md mt-2 max-w-[52ch] text-muted-foreground">
                    Your email app should have opened with everything filled in. Hit send there and we'll reply within
                    one business day. Nothing opened? Write to{' '}
                    <a className="text-primary underline underline-offset-[3px]" href={`mailto:${SITE.email}`}>
                      {SITE.email}
                    </a>
                    .
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8"
                    onClick={() => {
                      reset();
                      setSent(false);
                    }}
                  >
                    Send another enquiry
                  </Button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                  <Field label="Name" htmlFor="enquiry-name" required error={errors.name?.message} errorId="name-error">
                    <Input id="enquiry-name" autoComplete="name" {...register('name')} {...a11y('name')} />
                  </Field>
                  <Field label="Work email" htmlFor="enquiry-email" required error={errors.email?.message} errorId="email-error">
                    <Input id="enquiry-email" type="email" autoComplete="email" {...register('email')} {...a11y('email')} />
                  </Field>
                  <Field label="Company" htmlFor="enquiry-company">
                    <Input id="enquiry-company" autoComplete="organization" {...register('company')} />
                  </Field>
                  <Field label="Exporting from" htmlFor="enquiry-origin">
                    <Input id="enquiry-origin" autoComplete="country-name" placeholder="Country" {...register('origin')} />
                  </Field>

                  <fieldset className="sm:col-span-2">
                    <legend className="type-label-md mb-3 text-foreground">Target markets</legend>
                    <div className="flex flex-wrap gap-2">
                      {MARKET_CHOICES.map((m) => (
                        <FilterChip key={m} selected={markets.includes(m)} onClick={() => toggleMarket(m)}>
                          {m}
                        </FilterChip>
                      ))}
                    </div>
                  </fieldset>

                  <Field label="Product category" htmlFor="enquiry-category">
                    <Controller
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <SelectTrigger id="enquiry-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                  <Field label="Stage" htmlFor="enquiry-stage">
                    <Controller
                      control={control}
                      name="stage"
                      render={({ field }) => (
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <SelectTrigger id="enquiry-stage">
                            <SelectValue placeholder="Where are you now?" />
                          </SelectTrigger>
                          <SelectContent>
                            {STAGES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>

                  <Field
                    label="What are you shipping, and where?"
                    htmlFor="enquiry-message"
                    required
                    error={errors.message?.message}
                    errorId="message-error"
                    className="sm:col-span-2"
                  >
                    <Textarea id="enquiry-message" rows={5} {...register('message')} {...a11y('message')} />
                  </Field>

                  {/* Honeypot: hidden from people, tempting to bots. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="enquiry-website">Website</label>
                    <input id="enquiry-website" tabIndex={-1} autoComplete="off" {...register('website')} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={consentId} className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
                      <input
                        id={consentId}
                        type="checkbox"
                        className="peer sr-only"
                        {...register('consent')}
                        {...a11y('consent')}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border-2 border-input text-primary-foreground transition-colors duration-short3',
                          'peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring',
                          '[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100',
                        )}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="type-body-sm">
                        I understand this enquiry doesn't create an adviser–client relationship.
                      </span>
                    </label>
                    {errors.consent?.message && (
                      <p id="consent-error" className="type-body-sm mt-1 flex items-center gap-1.5 text-destructive">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {errors.consent.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      size="lg"
                      icon="trailing"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      Send enquiry
                      {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
                    </Button>
                    <span className="type-body-sm text-muted-foreground">* Required</span>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          <div className="col-span-4 space-y-6 md:col-span-12 lg:hidden">
            <ContactDetails rows={contactRows} />
            <NextSteps />
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactDetails = ({
  rows,
}: {
  rows: { icon: LucideIcon; label: string; value: string; href?: string }[];
}) => (
  <ul className="space-y-4">
    {rows.map((r) => (
      <li key={r.label} className="flex items-center gap-4">
        <IconContainer icon={r.icon} size="sm" />
        <div>
          <p className="type-label-sm text-muted-foreground">{r.label}</p>
          {r.href ? (
            <a href={r.href} className="type-title-sm hover:text-primary">
              {r.value}
            </a>
          ) : (
            <p className="type-title-sm">{r.value}</p>
          )}
        </div>
      </li>
    ))}
  </ul>
);

const NextSteps = () => (
  <div className="rounded-lg border border-outline-variant p-5 md:p-6">
    <h3 className="type-title-md font-sans">What happens next</h3>
    <ol className="mt-4 space-y-3">
      {NEXT_STEPS.map((s, i) => (
        <li key={s} className="type-body-md flex items-start gap-3">
          <span className="type-label-md flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-primary-on-container">
            {i + 1}
          </span>
          {s}
        </li>
      ))}
    </ol>
  </div>
);
