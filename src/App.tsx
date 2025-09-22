import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Index from "./pages/Index";
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
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/statutes" element={<Statutes />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/briefings" element={<Briefings />} />
                <Route path="/authors" element={<Authors />} />
                <Route path="/about" element={<About />} />
                <Route path="/search" element={<Search />} />
                <Route path="/categories/:category" element={<CategoryPage />} />
                <Route path="/post/:slug" element={<PostDetail />} />
                <Route path="/case/:slug" element={<PostDetail />} />
                <Route path="/statute/:slug" element={<PostDetail />} />
                <Route path="/guide/:slug" element={<PostDetail />} />
                <Route path="/briefing/:slug" element={<PostDetail />} />
                <Route path="/admin" element={<Admin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;