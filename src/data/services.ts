import { Anchor, FileSignature, Scale, ShieldCheck, ClipboardCheck, Waypoints, type LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  copy: string;
  deliverable: string;
  icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    id: 'structure',
    title: 'Market-entry structure',
    copy: 'Distributor, agent, or your own entity? We map the tax, liability and control trade-offs.',
    deliverable: 'Structure memo',
    icon: Waypoints,
  },
  {
    id: 'contracts',
    title: 'Export contracts & Incoterms',
    copy: 'Distribution, agency and supply agreements with clear delivery terms, exclusivity, termination and payment security.',
    deliverable: 'Signature-ready contract',
    icon: FileSignature,
  },
  {
    id: 'customs',
    title: 'Customs, HS codes & FTAs',
    copy: 'Tariff classification, rules of origin, and using ATIGA, RCEP or CPTPP preferences properly.',
    deliverable: 'Classification & origin file',
    icon: Anchor,
  },
  {
    id: 'registration',
    title: 'Product registration & licensing',
    copy: 'Food, cosmetics, medical devices, halal: coordinated with local licence holders.',
    deliverable: 'Registration roadmap',
    icon: ClipboardCheck,
  },
  {
    id: 'ip',
    title: 'Trademark & IP protection',
    copy: "File before you ship, country by country or via Madrid, and keep ownership out of your distributor's hands.",
    deliverable: 'Filing plan',
    icon: ShieldCheck,
  },
  {
    id: 'disputes',
    title: 'Disputes & payment risk',
    copy: 'Arbitration clauses that work (SIAC and others), letters of credit, and what to do when a buyer stops paying.',
    deliverable: 'Risk checklist',
    icon: Scale,
  },
];
