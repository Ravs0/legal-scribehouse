import { ReactNode, useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AlertCircle, Check, ChevronRight, Loader2, Mail, MapPin, Phone, Send, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconContainer } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeading } from '@/components/site/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { MarketsSelect } from '@/components/home/MarketsSelect';
import { SITE } from '@/config/site';
import { MARKETS } from '@/data/markets';
import { IS_PREVIEW, submitEnquiry, type Enquiry } from '@/lib/enquiry';
import { useEnquiryDraft } from '@/stores/enquiryDraft';

const CATEGORIES = ['Food & beverage', 'Cosmetics & personal care', 'Medical devices', 'Consumer goods', 'Industrial', 'Other'];
const STAGES = ['Exploring', 'Have a buyer', 'Already shipping', 'Have a problem'];
const MARKET_NAMES = MARKETS.map((m) => m.name);

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
  labelId,
  htmlFor,
  required,
  error,
  errorId,
  className,
  children,
}: {
  label: string;
  labelId?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={className}>
    <label id={labelId} htmlFor={htmlFor} className="type-label-md mb-1.5 block text-foreground">
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

  const onSubmit = async (values: FormValues) => {
    if (values.website) return;
    await submitEnquiry(values as Enquiry);
    setSent(true);
    if (!IS_PREVIEW)
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
    <section id="contact" className="section">
      <div className="container">
        {/* Confirm the response-time promise with the firm before launch. */}
        <SectionHeading
          eyebrow="Book a free call"
          title="Tell us what you're shipping, and where."
          subtitle="We reply within one business day with next steps."
        />
        {/* v3.12: on the grid. "What happens next" and the contact details in the left 4 columns, the form in the
            right 8, from 1024px. Below that: steps, form, details. */}
        <div className="after-heading grid-12 items-start">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <NextSteps />
            <div className="hidden lg:block">
              <ContactDetails rows={contactRows} />
            </div>
          </div>

          <Reveal className="col-span-4 md:col-span-12 lg:col-span-8">
            <div className="surface-3 panel-pad rounded-[14px]">
              {sent ? (
                <div role="status" className="flex animate-step-in flex-col items-start py-4">
                  <IconContainer icon={Check} tone="success" className="h-12 w-12" />
                  <p className="type-headline-sm mt-6">{IS_PREVIEW ? 'This is a preview of the form.' : "Thanks, we've got it."}</p>
                  {IS_PREVIEW ? (
                    <p className="type-body-md mt-2 max-w-[52ch] text-muted-foreground">
                      Enquiries aren't sent from this preview link. On the live site this opens a prefilled email to{' '}
                      <span className="select-all font-semibold text-foreground">{SITE.email}</span>.
                    </p>
                  ) : (
                    <p className="type-body-md mt-2 max-w-[52ch] text-muted-foreground">
                    Your email app should have opened with everything filled in. Hit send there and we'll reply within
                    one business day. Nothing opened? Write to{' '}
                    <a className="text-primary-ink underline underline-offset-[3px]" href={`mailto:${SITE.email}`}>
                      {SITE.email}
                    </a>
                    .
                  </p>
                  )}
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
                <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-x-3 gap-y-3.5 sm:grid-cols-2">
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

                  {/* v3.7: target markets is a multi-select drop-down; same string[] value as the old chips. */}
                  <Field label="Target markets" labelId="enquiry-markets-label" htmlFor="enquiry-markets">
                    <Controller
                      control={control}
                      name="markets"
                      render={({ field }) => (
                        <MarketsSelect
                          id="enquiry-markets"
                          labelId="enquiry-markets-label"
                          options={MARKET_NAMES}
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Field>

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
                  {/* v3.11: Stage is a full-width segmented choice (native radios), so the row has no empty half. */}
                  <fieldset className="sm:col-span-2">
                    <legend className="type-label-md mb-1.5 block text-foreground">Where are you now?</legend>
                    <Controller
                      control={control}
                      name="stage"
                      render={({ field }) => (
                        <div className="recessed grid grid-cols-2 gap-1 rounded-[10px] p-1 [background-color:var(--well-fill)] sm:grid-cols-4 sm:rounded-[7px]">
                          {STAGES.map((st) => (
                            <label key={st} className="relative">
                              <input
                                type="radio"
                                name={field.name}
                                value={st}
                                checked={field.value === st}
                                onChange={() => field.onChange(st)}
                                onBlur={field.onBlur}
                                className="peer sr-only"
                              />
                              <span className="press type-label-md flex h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-[10px] px-3 text-muted-foreground transition-[color,background-color,box-shadow] [transition-duration:200ms] hover:text-foreground peer-checked:surface-1 peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring sm:rounded-[7px]">
                                {st}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                  </fieldset>

                  <Field
                    label="What are you shipping, and where?"
                    htmlFor="enquiry-message"
                    required
                    error={errors.message?.message}
                    errorId="message-error"
                    className="sm:col-span-2"
                  >
                    <Textarea id="enquiry-message" rows={4} {...register('message')} {...a11y('message')} />
                  </Field>

                  {/* Honeypot: hidden from people, tempting to bots. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="enquiry-website">Website</label>
                    <input id="enquiry-website" tabIndex={-1} autoComplete="off" {...register('website')} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor={consentId} className="flex min-h-11 cursor-pointer items-start gap-3 py-3">
                      <input
                        id={consentId}
                        type="checkbox"
                        className="peer sr-only"
                        {...register('consent')}
                        {...a11y('consent')}
                      />
                      {/* v3.6: a 20px well; checked it becomes the orange button. Text line-height 20px centres line one on the box. */}
                      <span aria-hidden="true" className="check-well flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px]">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="type-body-sm leading-5">
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

          <div className="col-span-4 md:col-span-12 lg:hidden">
            <ContactDetails rows={contactRows} />
          </div>
        </div>
      </div>
    </section>
  );
};

/** v3.12: the contact details as a stacked list with hairlines (left column from 1024px; under the form below). */
const ContactDetails = ({
  rows,
}: {
  rows: { icon: LucideIcon; label: string; value: string; href?: string }[];
}) => (
  <Reveal as="ul" stagger className="mt-8 divide-y divide-border border-y border-border">
    {rows.map((r) => (
      <li key={r.label} className="flex items-center gap-3 py-3.5">
        <IconContainer icon={r.icon} size="sm" />
        <div className="min-w-0 text-left">
          <p className="type-label-sm text-muted-foreground">{r.label}</p>
          {r.href ? (
            <a href={r.href} className="hit type-title-sm relative block hover:text-primary-ink">
              {r.value}
            </a>
          ) : (
            <p className="type-title-sm">{r.value}</p>
          )}
        </div>
      </li>
    ))}
  </Reveal>
);

/** v3.12: "What happens next" as a numbered vertical list with a connecting rule. */
const NextSteps = () => (
  <Reveal>
    <section aria-labelledby="next-steps-title">
      <h3 id="next-steps-title" className="type-title-md">
        What happens next
      </h3>
      <ol className="relative mt-4 space-y-5 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-border">
        {NEXT_STEPS.map((s, i) => (
          <li key={s} className="relative flex items-start gap-3.5">
            <span className="type-label-md relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-border bg-card text-primary-ink tabular">
              {i + 1}
            </span>
            <span className="type-body-md pt-0.5 text-foreground">{s}</span>
          </li>
        ))}
      </ol>
    </section>
  </Reveal>
);
