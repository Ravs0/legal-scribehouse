import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/** Fades each new route in (300ms, emphasized-decelerate). */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
};
