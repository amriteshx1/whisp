
import Marquee from "react-fast-marquee";

const FeatureMarquee = () => {
  return (
    <div className="relative w-full bg-black p-[1vh] lg:px-[15vh] px-[5vh] lg:mt-[15vh] mt-[5vh]">
      <h2 className="text-center lg:text-[3vw] text-[1.8vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">
        What Powers Your Presence
      </h2>

      <Marquee
        gradient={true}
        gradientColor= "black"
        gradientWidth={60}
        speed={40}
        pauseOnHover={true}
        className="text-neutral-700 text-[1rem] font-medium"
      >
        <div className="flex lg:gap-[7vh] gap-[3vh] px-[2.5vh] lg:text-[1.5vw] text-[1.15vh] lg:mt-[7vh] mt-[3vh] bg-gradient-to-tl from-neutral-950 via-white/70 to-neutral-700 bg-clip-text text-transparent hover:cursor-default">
          <span>⚡ Speed</span>
          <span>🔒 Privacy</span>
          <span>☁️ Cloud Uploads</span>
          <span>📱 Mobile-Ready</span>
          <span>💬 Real-time Chat</span>
          <span>📞 Audio/Video Calls</span>
          <span>🌐 Always Synced</span>
          <span>🎯 Minimal UI</span>
        </div>
      </Marquee>
    </div>
  );
};

export default FeatureMarquee;