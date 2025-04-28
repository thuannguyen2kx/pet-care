import CallToAction from "./components/call-to-action";
import Footer from "./components/footer";
import Header from "./components/header";
import Hero from "./components/hero";
import LatestNews from "./components/lastest-news";
import SafeHands from "./components/SafeHand";
import Services from "./components/service";
import Stats from "./components/stats";
import TeamMembers from "./components/team-member";
import Testimonials from "./components/testimonials";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <SafeHands />
        <Testimonials />
        <TeamMembers />
        <CallToAction />
        <LatestNews />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
