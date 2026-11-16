import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { prefersReducedMotion } from "@/lib/reveal";

// v3.7: entrance and reveal animations hide content only while this class is set (JS running, motion allowed).
if (!prefersReducedMotion()) document.documentElement.classList.add("motion-ok");

createRoot(document.getElementById("root")!).render(<App />);
