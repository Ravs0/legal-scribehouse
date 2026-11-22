import '@/styles/polish-pages.css';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/site/SectionHeading';
import { SITE } from '@/config/site';

/**
 * Privacy, terms and disclaimer. PLACEHOLDER TEXT: a structure to start from, written for a Singapore-based firm
 * that collects enquiry details and runs a client portal. It must be reviewed and adapted by the firm (and checked
 * against the PDPA and any other law that applies) before launch.
 */
const DOCS = {
  privacy: {
    title: 'Privacy notice',
    sections: [
      ['What we collect', `When you send an enquiry we collect your name, email, company and what you tell us about your products and markets. If you use the client portal we also hold the documents and messages you share with us there.`],
      ['Why', 'To answer your enquiry, to provide legal services if you instruct us, to meet our professional and legal obligations, and to keep our systems secure.'],
      ['Who sees it', `People at ${SITE.name} who need it for your matter. Where local counsel is needed in another market, we share what they need for that work. Our hosting and email providers process data on our behalf.`],
      ['How long we keep it', 'Enquiries that do not become matters are deleted after a set period. Client files are kept for the period our professional rules require.'],
      ['Your choices', `You can ask for a copy of your data, ask us to correct it, or ask us to delete it where we are allowed to. Write to ${SITE.email}.`],
    ],
  },
  terms: {
    title: 'Terms of use',
    sections: [
      ['This site', `This website is published by ${SITE.name}. You may read and share its content for your own business use.`],
      ['No advice', 'Content on this site is general information, not legal advice for your situation. Contacting us does not create an adviser–client relationship; that starts only when we confirm an engagement in writing.'],
      ['The client portal', 'Portal access is personal to the people we invite. Keep your sign-in details private and tell us straight away if you think someone else has used them.'],
      ['Liability', 'We are not responsible for decisions made on the basis of the general information on this site.'],
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    sections: [
      ['General information', 'Information on this site is general in nature and is not legal advice. Rules on customs, trade agreements and product registration change often and vary by product.'],
      ['Local law', 'Advice on the law of a particular ASEAN country is given by, or together with, lawyers qualified in that country.'],
      ['Examples', 'Figures, routes and receipts shown on this site are illustrative examples, not results for any client.'],
    ],
  },
} as const;

const LegalPage = ({ doc }: { doc: keyof typeof DOCS }) => {
  const d = DOCS[doc];
  return (
    <section className="container pg-top pb-20 md:pb-24">
      <SectionHeading as="h1" index="—" eyebrow="Legal" title={d.title}>
        <Badge variant="warning" className="mt-4">Draft wording: to be reviewed before launch</Badge>
      </SectionHeading>
      <div className="grid-12 after-heading">
        <ol className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-4">
          {d.sections.map(([h, p], i) => (
            <li key={h} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-t border-border py-6 first:border-t-0 first:pt-0 md:grid-cols-[3rem_minmax(0,1fr)] md:py-8 md:first:pt-0">
              <span aria-hidden="true" className="sh-num tabular text-[22px] md:text-[26px]">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="type-title-lg">{h}</h2>
                <p className="type-body-lg mt-2 max-w-[62ch] text-muted-foreground">{p}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default LegalPage;
