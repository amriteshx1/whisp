
import Marquee from "react-fast-marquee";

const FeatureMarquee = () => {
  return (
    <div className="relative w-full bg-white p-[1vh] px-[15vh] mt-[15vh]">
      <h2 className="text-center text-[3vw] font-medium bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 bg-clip-text text-transparent">
        What Powers Your Presence
      </h2>

      <Marquee
        gradient={true}
        gradientColor= "white"
        gradientWidth={60}
        speed={40}
        pauseOnHover={false}
        className="text-neutral-700 text-[1rem] font-medium"
      >
        <div className="flex gap-[7vh] px-[2.5vh] text-[1.5vw] mt-[7vh] bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 bg-clip-text text-transparent">
          <span>⚡ Speed</span>
          <span>🔒 Privacy</span>
          <span>☁️ Cloud Uploads</span>
          <span>📱 Mobile-Ready</span>
          <span>💬 Real-time Chat</span>
          <span>🌐 Always Synced</span>
          <span>🎯 Minimal UI</span>
          <span>🔔 Live Alerts</span>
        </div>
      </Marquee>
    </div>
  );
};

export default FeatureMarquee;