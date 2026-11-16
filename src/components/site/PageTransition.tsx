import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

/** v3.7: each new route fades in with an 8px rise (200ms, --ease-out). */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
};
