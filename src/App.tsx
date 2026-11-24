import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

// Hosted previews can't change the page URL, so they route in memory.
const Router = import.meta.env.VITE_ARTIFACT ? MemoryRouter : BrowserRouter;
import { ThemeProvider } from "next-themes";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Index from "./pages/Index";
import Insights from "./pages/Insights";
import { ScrollManager } from "@/components/site/ScrollManager";
import { DawnBackground } from "@/components/site/DawnBackground";
import { PebbleLight } from "@/components/site/PebbleLight";
import { PageTransition } from "@/components/site/PageTransition";
import { SeamFade } from "@/components/site/SeamFade";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import Posts from "./pages/Posts";
import Cases from "./pages/Cases";
import Statutes from "./pages/Statutes";
import Guides from "./pages/Guides";
import Briefings from "./pages/Briefings";
import Authors from "./pages/Authors";
import About from "./pages/About";
import Search from "./pages/Search";
import CategoryPage from "./pages/CategoryPage";
import PostDetail from "./pages/PostDetail";
import NotFound from "./pages/NotFound";

// Public pages added for v5.
import ServicesPage, { ServiceDetail } from "./pages/Services";
import MarketsPage, { MarketDetail } from "./pages/MarketsPage";
import TeamPage from "./pages/TeamPage";
import LegalPage from "./pages/Legal";
import { Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

// The workspace and portal load on demand, so public visitors never download them.
const Login = lazy(() => import("./workspace/pages/Login"));
const WorkspaceRoutes = lazy(() => import("./workspace/routes"));

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } });

/** Public site chrome: background, header, footer, page transition. */
const SiteChrome = () => (
  <>
    <DawnBackground />
    <PebbleLight />
    <ScrollProgress />
    <div className="relative flex min-h-screen min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      {/* Page ground → the ink footer, on every public page. */}
      <SeamFade from="transparent" via="hsl(var(--corp-ink) / 0.5)" to="hsl(var(--corp-ink))" height={150} />
      <Footer />
    </div>
  </>
);

const Loading = () => <div className="grid min-h-dvh place-items-center text-muted-foreground">Loading…</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" />
        <Router>
          <ScrollManager />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/workspace/*" element={<WorkspaceRoutes area="workspace" />} />
              <Route path="/portal/*" element={<WorkspaceRoutes area="portal" />} />
              <Route element={<SiteChrome />}>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/markets" element={<MarketsPage />} />
                <Route path="/markets/:code" element={<MarketDetail />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/privacy" element={<LegalPage doc="privacy" />} />
                <Route path="/terms" element={<LegalPage doc="terms" />} />
                <Route path="/disclaimer" element={<LegalPage doc="disclaimer" />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:id" element={<PostDetail />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/statutes" element={<Statutes />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/briefings" element={<Briefings />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/categories/:category" element={<CategoryPage />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/statute/:id" element={<PostDetail />} />
                <Route path="/guide/:id" element={<PostDetail />} />
                <Route path="/briefing/:id" element={<PostDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
