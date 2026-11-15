import { AnchorHTMLAttributes, forwardRef, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HashLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Homepage section id, without the '#'. */
  to: string;
}

/** Link to a homepage section that works from any route (navigates home, then scrolls). */
export const HashLink = forwardRef<HTMLAnchorElement, HashLinkProps>(({ to, onClick, children, ...rest }, ref) => {
  const location = useLocation();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (location.pathname === '/') {
      const el = document.getElementById(to);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ block: 'start' });
        window.history.replaceState(null, '', `#${to}`);
      }
    }
  };
  return (
    <Link ref={ref} to={`/#${to}`} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
});
HashLink.displayName = 'HashLink';
