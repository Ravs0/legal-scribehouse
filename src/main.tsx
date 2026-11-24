import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/perf.css";
import "./styles/type.css";
import { prefersReducedMotion } from "@/lib/reveal";
import { watchOffscreen } from "@/lib/offscreen";

// v3.7: entrance and reveal animations hide content only while this class is set (JS running, motion allowed).
if (!prefersReducedMotion()) document.documentElement.classList.add("motion-ok");

createRoot(document.getElementById("root")!).render(<App />);
watchOffscreen();
