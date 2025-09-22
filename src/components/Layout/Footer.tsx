import { Link } from 'react-router-dom';
import { LEGAL_CATEGORIES } from '@/types/blog';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary"></div>
              <div>
                <div className="font-bold">cicero's scribe</div>
                <div className="text-sm text-muted-foreground">then there was law</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A comprehensive legal blog covering analysis, cases, statutes, and insights across multiple jurisdictions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Content</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/posts" className="text-muted-foreground hover:text-primary">Posts</Link></li>
              <li><Link to="/cases" className="text-muted-foreground hover:text-primary">Cases</Link></li>
              <li><Link to="/statutes" className="text-muted-foreground hover:text-primary">Statutes</Link></li>
              <li><Link to="/guides" className="text-muted-foreground hover:text-primary">Guides</Link></li>
              <li><Link to="/briefings" className="text-muted-foreground hover:text-primary">Briefings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Topics</h3>
            <ul className="space-y-2 text-sm">
              {LEGAL_CATEGORIES.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link to={`/categories/${category.slug}`} className="text-muted-foreground hover:text-primary">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link to="/authors" className="text-muted-foreground hover:text-primary">Authors</Link></li>
              <li><Link to="/search" className="text-muted-foreground hover:text-primary">Search</Link></li>
              <li><Link to="/rss.xml" className="text-muted-foreground hover:text-primary">RSS Feed</Link></li>
              <li><Link to="/sitemap.xml" className="text-muted-foreground hover:text-primary">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Cicero's Scribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;