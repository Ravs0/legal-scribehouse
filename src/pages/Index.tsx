import { Hero } from '@/components/home/HeroStage';
import { SeamFade } from '@/components/site/SeamFade';
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
    {/* Sand floor → the story's sand stage. */}
    <SeamFade from="#D5B792" to="#F2E6D6" height={72} />
    <ScrollStory />
    {/* The story ends on ink; the desk room is teal. Dusk into the room. */}
    <SeamFade from="#16120F" to="#22676B" height={140} />
    <Desk />
    {/* The desk's cast shadow falls onto the next room's cream wall. */}
    <SeamFade from="#80502A" via="#4A2B15 18%, rgb(120 84 58 / 0.6) 55%, #F7EEE1 92%" to="#F7EEE1" height={130} />
    <Services />
    <SeamFade from="#E1C8A0" to="#F6C49B" height={56} />
    <Process />
    {/* The teal sea shallows onto the page ground (works in both themes). */}
    <SeamFade from="#0D3E43" via="rgb(13 62 67 / 0.45)" to="transparent" height={170} />
    <Markets />
    <ReadinessCheck />
    <Glance />
    {/* Daylight → the ink ledger wall, like evening falling. */}
    <SeamFade from="transparent" via="rgb(31 25 21 / 0.55)" to="#1F1915" height={170} />
    <Proof />
    <SeamFade from="#120F0D" via="rgb(18 15 13 / 0.5)" to="transparent" height={170} />
    <InsightsTeaser />
    <Faq />
    <Contact />
  </>
);

export default Index;
