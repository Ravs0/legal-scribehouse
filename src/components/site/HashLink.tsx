import { AnchorHTMLAttributes, MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HashLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Homepage section id, without the '#'. */
  to: string;
}

/** Link to a homepage section that works from any route (navigates home, then scrolls). */
export const HashLink = ({ to, onClick, children, ...rest }: HashLinkProps) => {
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
    <Link to={`/#${to}`} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
};
