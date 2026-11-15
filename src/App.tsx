import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Index from "./pages/Index";
import Insights from "./pages/Insights";
import { ScrollManager } from "@/components/site/ScrollManager";
import { AuroraBackground } from "@/components/site/AuroraBackground";
import { StoneCanvas } from "@/components/site/StoneCanvas";
import { PageTransition } from "@/components/site/PageTransition";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner position="bottom-right" />
        <BrowserRouter>
          <ScrollManager />
          <AuroraBackground />
          <StoneCanvas />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/insights" element={<Insights />} />
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
              </Routes>
              </PageTransition>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;