import { Link } from 'react-router-dom';
import { SITE } from '@/config/site';
import { MARKETS } from '@/data/markets';
import { SERVICES } from '@/data/services';
import { HashLink } from '@/components/site/HashLink';
import { INSIGHT_LINKS } from '@/config/nav';
import { Wordmark } from './Header';

const WAVE = String.raw`   .--.      .--.      .--.
--'    '----'    '----'    '--
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark />
          <p className="mt-2 text-sm text-muted-foreground">{SITE.descriptor}</p>
          <p className="mt-4 font-display text-xl font-semibold">{SITE.tagline}</p>
          <pre aria-hidden="true" className="mt-6 select-none overflow-hidden font-mono text-xs leading-tight text-ascii">
            {WAVE}
          </pre>
        </div>

        <div className="lg:col-span-3">
          <h2 className="label-mono mb-4 text-muted-foreground">Services</h2>
          <ul className="space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <HashLink to="services" className="hover:text-primary">
                  {s.title}
                </HashLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="label-mono mb-4 text-muted-foreground">Markets</h2>
          <ul className="grid grid-cols-5 gap-x-3 gap-y-2 font-mono text-sm sm:grid-cols-4 lg:grid-cols-3">
            {MARKETS.map((m) => (
              <li key={m.code}>
                <HashLink to="markets" className="hover:text-accent" title={m.name}>
                  {m.code}
                </HashLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="label-mono mb-4 text-muted-foreground">Insights</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/posts" className="hover:text-primary">
                Posts
              </Link>
            </li>
            {INSIGHT_LINKS.slice(1).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="perforation mt-12" aria-hidden="true" />
      <div className="mt-6 flex flex-col gap-4 text-xs text-muted-foreground md:flex-row md:justify-between">
        <p className="font-mono">
          © {new Date().getFullYear()} {SITE.name}
        </p>
        {/* Disclaimer wording depends on the firm's regulatory status; confirm before launch. */}
        <p className="max-w-3xl leading-relaxed md:text-right">
          Information on this site is general in nature and is not legal advice. Contacting us does not create an
          adviser–client relationship. Local-law services are provided with independent local counsel where required.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
