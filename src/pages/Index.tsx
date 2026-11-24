import { Hero } from '@/components/home/HeroStage';
import { ScrollStory } from '@/components/home/ScrollStory';
import { Desk } from '@/components/home/Desk';
import { Markets } from '@/components/home/Markets';
import { Services } from '@/components/home/Services';
import { Glance } from '@/components/home/Glance';
import { Process } from '@/components/home/Process';
import { ReadinessCheck } from '@/components/home/ReadinessCheck';
import { Proof } from '@/components/home/Proof';
import { InsightsTeaser } from '@/components/home/InsightsTeaser';
import { Faq } from '@/components/home/Faq';
import { Contact } from '@/components/home/Contact';

// v4.0 "Regional desk" order: the desk and its people first, then what we do and how, where, the interactive
// tools, proof, reading, questions, contact.
const Index = () => (
  <>
    <Hero />
    <ScrollStory />
    <Desk />
    <Services />
    <Process />
    <Markets />
    <ReadinessCheck />
    <Glance />
    <Proof />
    <InsightsTeaser />
    <Faq />
    <Contact />
  </>
);

export default Index;
