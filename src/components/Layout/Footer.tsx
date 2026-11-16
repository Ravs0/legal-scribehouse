import { Link } from 'react-router-dom';
import { SITE } from '@/config/site';
import { INSIGHT_LINKS, SECTIONS } from '@/config/nav';
import { HashLink } from '@/components/site/HashLink';
import { ThemeToggle, Wordmark } from './Header';
import { Contours } from '@/components/site/Contours';

const linkClass = 'type-body-sm flex min-h-10 items-center text-muted-foreground transition-colors hover:text-foreground md:min-h-0 md:py-1';

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-outline-variant bg-surface-low/80">
    <Contours className="absolute inset-0 h-full w-full" opacity={0.55} />
    <div className="container relative pb-6 pt-10 md:pb-8 md:pt-12">
      <div className="grid-12 gap-y-10">
        <div className="col-span-4 md:col-span-12 lg:col-span-4">
          <Wordmark />
          <p className="type-body-md mt-4 max-w-[36ch] text-muted-foreground">{SITE.tagline}</p>
          <div className="mt-6 space-y-1">
            <a href={`mailto:${SITE.email}`} className="type-label-lg block hover:text-primary-ink">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="type-body-md block text-muted-foreground hover:text-primary-ink">
              {SITE.phone}
            </a>
          </div>
        </div>

        <nav aria-label="Explore" className="col-span-2 md:col-span-3 lg:col-span-2 lg:col-start-6">
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

        {/* Disclaimer wording depends on the firm's regulatory status; confirm before launch. */}
        <div className="col-span-4 md:col-span-6 lg:col-span-3">
          <div className="surface-1 rounded-[20px] p-4">
            <h2 className="type-label-md font-sans text-foreground">Disclaimer</h2>
            <p className="type-body-sm mt-2 text-muted-foreground">
              Information on this site is general in nature and is not legal advice. Contacting us does not create an
              adviser–client relationship. Local-law services are provided with independent local counsel where
              required.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-outline-variant pt-5">
        <p className="type-body-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <ThemeToggle />
      </div>
    </div>
  </footer>
);

export default Footer;
