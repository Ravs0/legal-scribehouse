import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => (
  <div className="container flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
    <p className="type-display-lg text-gradient tabular" aria-hidden="true">
      404
    </p>
    <h1 className="type-headline-md mt-4">This route isn't on the map.</h1>
    <p className="type-body-md mt-2 text-muted-foreground">The page moved or never existed.</p>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild icon="trailing">
        <Link to="/">
          Back to home <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild variant="ghost">
        <Link to="/insights">Browse insights</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
