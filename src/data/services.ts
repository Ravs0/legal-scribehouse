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
    copy: 'Distributor, agent or your own entity? We set out what each means for tax, liability and control, then recommend one.',
    deliverable: 'Structure memo',
    icon: Waypoints,
  },
  {
    id: 'contracts',
    title: 'Export contracts & Incoterms',
    copy: 'Distribution, agency and supply agreements that pin down delivery terms, exclusivity, exit and how you get paid.',
    deliverable: 'Signature-ready contract',
    icon: FileSignature,
  },
  {
    id: 'customs',
    title: 'Customs, HS codes & FTAs',
    copy: 'The right tariff code for the destination, origin paperwork in order, and ATIGA, RCEP or CPTPP rates claimed where your goods qualify.',
    deliverable: 'Classification & origin file',
    icon: Anchor,
  },
  {
    id: 'registration',
    title: 'Product registration & licensing',
    copy: "Food, cosmetics, medical devices, halal. We map what's needed and work with the local licence holder to get it filed.",
    deliverable: 'Registration roadmap',
    icon: ClipboardCheck,
  },
  {
    id: 'ip',
    title: 'Trademark & IP protection',
    copy: "File before you ship, country by country or through Madrid, so the mark sits in your name and not your distributor's.",
    deliverable: 'Filing plan',
    icon: ShieldCheck,
  },
  {
    id: 'disputes',
    title: 'Disputes & payment risk',
    copy: 'Arbitration clauses drafted to be enforceable (SIAC and others), letters of credit, and a plan for when a buyer stops paying.',
    deliverable: 'Risk checklist',
    icon: Scale,
  },
];
