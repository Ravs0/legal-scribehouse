import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SHIP = String.raw`
        __|__
  ___/_[]_[]\__
  \__________/
~~~~~~~~~~~~~~~~~~~~~`;

const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <pre aria-hidden="true" className="select-none font-mono text-sm leading-tight text-ascii sm:text-base">
        {SHIP}
      </pre>
      <p className="label-mono mt-8 text-accent">ERR 404 · Consignment not found</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">This page never left port.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Nothing is manifested at <code className="break-all font-mono text-sm text-foreground">{pathname}</code>.
      </p>
      <Button asChild className="arrow-nudge mt-8 rounded-sm font-mono">
        <Link to="/">
          Back to home <span className="arrow">-&gt;</span>
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
