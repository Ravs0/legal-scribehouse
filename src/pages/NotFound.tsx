import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '@/styles/polish-pages.css';
import { Button } from '@/components/ui/button';
import { Contours } from '@/components/site/Contours';

const NotFound = () => (
  <div className="container relative flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
    <div aria-hidden="true" className="bezel absolute inset-x-4 inset-y-8 -z-0 rounded-[16px] opacity-70 md:inset-x-16">
      <div className="bezel-well relative h-full w-full overflow-hidden rounded-[14px]">
        <Contours className="absolute inset-0 h-full w-full" />
        <span className="absolute left-[70%] top-[22%] flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-[0_0_0_6px_hsl(var(--primary)/0.2)]" />
      </div>
    </div>
    <p className="type-display-lg text-gradient tabular relative" aria-hidden="true">
      404
    </p>
    <h1 className="type-headline-md relative mt-4">This route isn't on the map.</h1>
    <p className="type-body-md relative mt-2 text-muted-foreground">The page moved or never existed.</p>
    <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild icon="trailing">
        <Link to="/">
          Back to home <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/insights">Browse insights</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
