import { About, Explore, Feedback, GetStarted, Hero, Insights, WhatsNew, World } from './sections';

const Page = () => (
  <div className="bg-[#1A232E] overflow-hidden">
    
    <Hero className="mt-3" />
    <div className="relative">
      <About />
      <div className="gradient-03 z-0" />
      <Explore />
    </div>
    <div className="relative">
      <GetStarted />
      <div className="gradient-04 z-0" />
      <WhatsNew />
    </div>
    <World />
    <div className="relative">
      <Insights />
      <div className="gradient-04 z-0" />
      <Feedback />
    </div>
  </div>
);

export default Page;
