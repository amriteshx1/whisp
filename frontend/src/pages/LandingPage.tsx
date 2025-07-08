
import FeatureMarquee from "../components/Marquee";
import landing from "../assets/landing.png";
import instagram from "../assets/instagram.png";
import discord from "../assets/discord.png";
import github from "../assets/github.png";
import twitter from "../assets/twitter.png";

const LandingPage = () => {
  return (
      <div className="min-h-screen w-full relative overflow-auto">
        <div
          className="absolute inset-0 z-0 h-full w-full"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #90caff 100%)",
          }}
        >
        
        <div className="h-[9vh] flex justify-between items-center text-zinc-600 p-[1vh] mx-[15vh] mt-[2vh] rounded-2xl ">
            <div className='w-[60%] flex justify-start items-center'>
                <p className='text-[2vw] font-medium bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 bg-clip-text text-transparent'>Whisp.</p>
            </div>

            <div className='w-[40%] flex gap-[4vh] justify-end items-center'>
                <p className='text-[1.1vw] cursor-pointer font-medium hover:text-zinc-500'>About</p>
                <p className='text-[1.1vw] font-medium cursor-pointer hover:text-zinc-500'>Features</p>
                <p className='text-[1.1vw] font-medium cursor-pointer hover:text-zinc-500'>How it works</p>
                <button className='block text-[1.1vw] font-medium cursor-pointer hover:text-zinc-500'>Sign in</button>
                <button
                className='text-[1vw] font-medium p-[1vh] px-[2vh] rounded-4xl bg-zinc-100 cursor-pointer hover:bg-sky-100'>Get Started</button>
            </div>
        </div>

        <div className="min-h-[85vh] flex flex-col justify-start items-center p-[1vh]">
            <div className="flex flex-col justify-center items-center mt-[5vh] text-zinc-700">
                <p className="text-[4.5vw] font-medium bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 bg-clip-text text-transparent">Conversations That Feel Close</p>
                <p className="text-[4.5vw] font-medium bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 bg-clip-text text-transparent">Even From Afar</p>
                <p className="text-[1.5vw] bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 bg-clip-text text-transparent">Stay connected — softly, silently, seamlessly.</p>
                <button className="text-[1.4vw] font-medium bg-gradient-to-tl from-neutral-950 via-zinc-500 to-neutral-700 px-[2.5vh] py-[1vh] rounded-3xl cursor-pointer text-zinc-100 mt-[2.5vh]">Step into Whisp</button>
            </div>

            <div className="flex justify-center items-center h-[75vh] mt-[2vh]">
                <img src={landing} alt="landingPage-image" className="h-full object-cover" />
            </div>

            


        </div>





        </div>
      </div>

  )
}

export default LandingPage;
