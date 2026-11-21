import { Link } from 'react-router-dom';
import { SITE } from '@/config/site';
import { INSIGHT_LINKS, SECTIONS } from '@/config/nav';
import { HashLink } from '@/components/site/HashLink';
import { ArrowUp } from 'lucide-react';
import { Wordmark } from './Header';
import { Reveal } from '@/components/motion/Reveal';

// v3.7: 44px rows on touch widths (<1024), compact list from 1024.
const linkClass = 'type-body-sm flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground lg:min-h-0 lg:py-1';

const Footer = () => (
  <footer className="band-ink relative overflow-hidden">
    <div className="footer-safe container relative pt-14 md:pt-20">
      <Reveal stagger className="grid-12 gap-y-10">
        <div className="col-span-4 md:col-span-12 lg:col-span-3">
          <Wordmark />
          <p className="type-body-md mt-4 max-w-[36ch] text-muted-foreground">{SITE.tagline}</p>
          <div className="mt-4 lg:mt-6 lg:space-y-1">
            <a href={`mailto:${SITE.email}`} className="type-label-lg flex min-h-11 items-center hover:text-primary-ink lg:block lg:min-h-0">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="type-body-md flex min-h-11 items-center text-muted-foreground hover:text-primary-ink lg:block lg:min-h-0">
              {SITE.phone}
            </a>
          </div>
        </div>

        <nav aria-label="Explore" className="col-span-2 md:col-span-3 lg:col-span-2">
          <h2 className="type-label-md mb-3 font-sans text-foreground">Explore</h2>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <HashLink to={s.id} className={linkClass}>
                  {s.label}
                </HashLink>
              </li>
            ))}
            <li>
              <Link to="/about" className={linkClass}>
                About
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Insights" className="col-span-2 md:col-span-3 lg:col-span-2">
          <h2 className="type-label-md mb-3 font-sans text-foreground">Insights</h2>
          <ul>
            {INSIGHT_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Firm" className="col-span-2 md:col-span-3 lg:col-span-2">
          <h2 className="type-label-md mb-3 font-sans text-foreground">Firm</h2>
          <ul>
            {[
              ['/services', 'Services'],
              ['/markets', 'Markets'],
              ['/team', 'Team'],
              ['/login', 'Client & team sign-in'],
              ['/privacy', 'Privacy'],
              ['/terms', 'Terms'],
              ['/disclaimer', 'Disclaimer'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className={linkClass}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Disclaimer wording depends on the firm's regulatory status; confirm before launch. */}
        <div className="col-span-4 md:col-span-3 lg:col-span-3">
          <div className="rounded-[10px] border border-border p-4">
            <h2 className="type-label-md font-sans text-foreground">Disclaimer</h2>
            <p className="type-body-sm mt-2 text-muted-foreground">
              Information on this site is general in nature and is not legal advice. Contacting us does not create an
              adviser–client relationship. Local-law services are provided with independent local counsel where
              required.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-12 flex items-center justify-between border-t border-border pt-5 md:mt-16">
        <p className="type-body-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }} className="type-label-md inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground lg:min-h-0">
          Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
