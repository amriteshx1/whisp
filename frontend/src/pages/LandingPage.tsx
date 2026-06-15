
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FeatureMarquee from "../components/Marquee";
import landing from "../assets/landing.jpg";
import instagram from "../assets/instagram.png";
import discord from "../assets/discord.png";
import github from "../assets/github.png";
import twitter from "../assets/twitter.png";
import { useRef } from "react";

const LandingPage = () => {

  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  }

  return (
      
<div className="h-screen w-full relative overflow-auto bg-black">
        <div className="flex justify-between items-center text-neutral-500 lg:py-2 lg:px-20 md:py-4 md:px-10 py-3 px-5">
            <div className='lg:w-[40%] w-[20%] flex justify-start items-center'>
                <p className='lg:text-[1.6vw] md:text-[1.5vh] text-[1.8vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent'>Whisp.</p>
            </div>

            <div className='lg:w-[50%] w-[70%] flex lg:gap-[4vh] md:gap-[3vh] gap-[2vh] justify-end items-center'>
                <p onClick={() => scrollToSection(featuresRef)} className='lg:text-base md:block hidden text-sm cursor-pointer font-medium hover:text-neutral-400'>About</p>
                <p onClick={() => scrollToSection(featuresRef)} className='lg:text-base md:block hidden text-sm font-medium cursor-pointer hover:text-neutral-400'>Features</p>
                <p onClick={() => scrollToSection(howItWorksRef)} className='lg:text-base lg:block hidden text-sm font-medium cursor-pointer hover:text-neutral-400'>How it works</p>
                <button onClick={handleClick} className='block lg:text-base md:text-sm text-xs font-medium cursor-pointer hover:text-neutral-400'>Sign in</button>
                <button onClick={handleClick}
                className='lg:text-sm md:text-xs text-[10px] text-white/55 font-medium md:py-1 md:px-3 py-0.5 px-2 rounded-3xl bg-neutral-900 cursor-pointer hover:text-white/90'>Get Started</button>
            </div>
        </div>

        <div className="min-h-[85vh] flex flex-col justify-start items-center p-[1vh] overflow-hidden">
            <div className="flex flex-col justify-center items-center mt-[6vh] pt-[1vh] text-zinc-700">
              <div className="flex justify-center items-center gap-3 lg:py-[1vh] lg:px-[2vh] py-[0.7vh] px-[1vh] lg:text-[0.8vw] md:text-[0.85vh] text-[0.8vh] border border-neutral-800 rounded-full text-white/75">
                <p>✔ Instant Messaging</p>
                <p>✔ End-to-End Encryption</p>
                <p>✔ Crystal-Clear Calls</p>
              </div>
                <motion.p 
                  initial={{ y: 15, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}    
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="lg:text-[4.5vw] md:text-[3.5vh] text-[3vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Conversations That Feel Close</motion.p>
                <motion.p 
                  initial={{ y: 15, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}    
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                  className="lg:text-[4.5vw] md:text-[3.5vh] text-[3vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Even From Afar</motion.p>
                <motion.p 
                  initial={{ y: 15, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}    
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                  className="lg:text-[1.5vw] md:text-[1.3vh] text-[1.5vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Stay connected — softly, silently, seamlessly.</motion.p>
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}    
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                  onClick={handleClick} className="lg:text-[1.2vw] md:text-[1vh] text-[1.1vh] bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 lg:px-[2.5vh] lg:py-[1vh] px-[1.3vh] py-[0.7vh] rounded-3xl cursor-pointer text-white/75 md:mt-5 mt-3 hover:text-white/90 ">Step into Whisp</motion.button>
            </div>

            <div className="flex justify-center items-center w-full relative">
                <img src={landing} alt="landingPage-image" width={5000} height={1796} fetchPriority="high" className="w-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full lg:h-44 md:h-32 h-15 bg-gradient-to-b from-transparent via-black/85 to-black pointer-events-none"></div>
            </div>

            <FeatureMarquee ref={featuresRef} />

            <div className="flex flex-col justify-center items-center lg:mt-[20vh] mt-[8vh] lg:mb-[10vh] mb-[0vh] w-full lg:mx-[15vh] mx-[5vh]">
                <h2 className="lg:text-[3vw] text-[1.8vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Why Whisp?</h2>
                <div className="flex flex-row flex-wrap justify-around items-center md:gap-0 gap-[2vh] lg:mt-[7vh] md:mt-[3vh] mt-[2vh] text-center">

                    <div className="flex lg:h-[30vh] md:h-[15vh] h-[12vh] border-l border-t border-neutral-950 bg-gradient-to-br from-black via-transparent to-neutral-950 md:w-[25%] w-[45%] flex-col justify-center items-center lg:gap-8 md:gap-6 gap-4 lg:p-[4vh] p-[1.5vh] rounded-3xl">
                        <p className="lg:text-[1.5vw] text-[1.15vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">🔐 Private by Design</p>
                        <p className="lg:text-[1.2vw] text-[1vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Messages are end-to-end protected. Your convos stay yours.</p>
                    </div>
                    <div className="flex lg:h-[30vh] md:h-[15vh] h-[12vh] border-l border-t border-r border-neutral-950 bg-gradient-to-b from-black via-transparent to-neutral-950 md:w-[25%] w-[45%] flex-col justify-center items-center lg:gap-8 md:gap-6 gap-4 lg:p-[4vh] p-[1.5vh] rounded-3xl">
                        <p className="lg:text-[1.5vw] text-[1.15vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">⚡ Real-time, Always</p>
                        <p className="lg:text-[1.2vw] text-[1vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Send, receive, seen — all in a blink. Zero lag, no reloads.</p>
                    </div>
                    <div className="flex lg:h-[30vh] md:h-[15vh] h-[12vh] border-r border-t border-neutral-950 bg-gradient-to-bl from-black via-transparent to-neutral-950 md:w-[25%] w-[45%] flex-col justify-center items-center lg:gap-8 md:gap-6 gap-4 lg:p-[4vh] p-[1.5vh] rounded-3xl">
                        <p className="lg:text-[1.5vw] text-[1.15vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">📞 Calls Made Simple</p>
                        <p className="lg:text-[1.2vw] text-[1vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Crystal-clear audio & video calls. Connect in one tap, no hassle.</p>
                    </div>

                </div>

            </div>

            <div ref={howItWorksRef} className="lg:min-h-[100vh] min-h-[50vh] w-full flex flex-col justify-start items-center mt-[10vh] lg:mb-[10vh] mb-[5vh] mx-[15vh]">
              <p className="lg:text-[3vw] text-[1.8vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">How It Works</p>

              <div className="flex w-full lg:flex-row flex-col justify-around items-center relative lg:gap-0 gap-[5vh] lg:mt-[7vh] mt-[5vh]">
                <div className="lg:w-[25%] w-[80%] flex lg:flex-col flex-row-reverse lg:justify-start justify-center items-center lg:gap-6 md:gap-8 gap-6">
                <div className="flex flex-col justify-around items-center md:gap-6 gap-4 lg:p-16 md:p-9 p-5 rounded-full bg-gradient-to-br from-neutral-950 via-transparent to-neutral-900">
                  <p className="lg:text-[1.5vw] text-[1.15vh] text-center font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Sign up & Get Your Friend Code</p>
                  <p className="lg:text-[1.1vw] text-[1vh] text-center font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Create your free account and instantly receive your unique friend code on your profile.</p>
                </div>
                <p className="lg:text-[1.3vw] text-[1.05vh] py-1 lg:px-6 px-3 rounded-4xl bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75">1</p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 100"
                  className="absolute hidden lg:block left-[25%] top-[15vh] w-[200px] h-[100px] text-white/40"
                >
                  <path
                    d="M 10 80 Q 100 10 190 80"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>

                <div className="lg:w-[25%] w-[80%] flex lg:flex-col md:flex-row-reverse flex-row lg:justify-start justify-center items-center lg:gap-6 md:gap-8 gap-6 lg:translate-y-[35vh]">
                <div className="flex flex-col justify-around items-center md:gap-6 gap-4 lg:p-16 md:p-9 p-5 rounded-full bg-gradient-to-br from-neutral-950 via-transparent to-neutral-900">
                  <p className="lg:text-[1.5vw] text-[1.15vh] text-center font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Connect with Friends</p>
                  <p className="lg:text-[1.1vw] text-[1vh] text-center font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Share your code with friends or search theirs to send a request. Accept or reject requests right inside your Friends page.</p>
                </div>
                <p className="lg:text-[1.3vw] text-[1.05vh] py-1 lg:px-6 px-3 rounded-4xl bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75">2</p>
                </div>

                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 100"
                  className="absolute hidden lg:block left-[60%] top-[50vh] w-[200px] h-[100px] text-white/40"
                >
                  <path
                    d="M 10 20 Q 100 90 190 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="5"
                      refY="5"
                      orient="auto"
                    >
                      <path d="M0,0 L10,5 L0,10 Z" fill="currentColor" />
                    </marker>
                  </defs>
                </svg>

                <div className="lg:w-[25%] w-[80%] flex lg:flex-col flex-row-reverse lg:justify-start justify-center items-center lg:gap-6 md:gap-8 gap-6">
                <div className="flex flex-col justify-around items-center md:gap-6 gap-4 lg:p-16 md:p-9 p-5 rounded-full bg-gradient-to-br from-neutral-950 via-transparent to-neutral-900">
                  <p className="lg:text-[1.5vw] text-[1.15vh] text-center font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Start Enjoying</p>
                  <p className="lg:text-[1.1vw] text-[1.1vh] text-center font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Once connected, enjoy real-time chat, audio/video calls & a lot - all in one smooth experience.</p>
                </div>
                <p className="lg:text-[1.3vw] text-[1.05vh] py-1 lg:px-6 px-3 rounded-4xl bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75">3</p>
                </div>

              </div>
              
            </div>

            <div className="lg:h-screen h-[55vh] w-full overflow-auto relative bg-black">
              
              <div className="flex flex-col justify-center items-center lg:mt-[10vh] mt-[5vh] w-full">
                <h2 className="lg:text-[3vw] text-[1.8vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent">Let your conversations begin.</h2>
                <p className="lg:text-xl md:text-xs text-[10px] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent lg:mt-[2vh] mt-[1vh]">Sign up and start chatting with your friends today.</p>
                <button onClick={handleClick} className="lg:text-lg md:text-xs text-[10px] font-medium bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 lg:px-[7vh] px-[2vh] lg:py-[1vh] py-[0.6vh] md:rounded-xl rounded-lg cursor-pointer text-white/75 hover:text-white/90 lg:mt-[3vh] md:mt-[2vh] mt-[1vh]">Get Started</button>
              </div>

              <div className="flex flex-col w-full lg:mt-[20vh] mt-[10vh]">

                <div className=" w-full flex justify-around items-center">
                    <div className="w-[30%] flex flex-col justify-start items-center">
                        <p className="lg:text-[1.2vw] text-[0.95vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent lg:mb-[2vh] mb-[1.5vh]">Company</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">About Us</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Our Services</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Privacy Policy</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Affiliate Program</p>
                    </div>

                    <div className="w-[30%] flex flex-col justify-start items-center">
                        <p className="lg:text-[1.2vw] text-[0.95vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent lg:mb-[2vh] mb-[1.5vh]">Product</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Whisp Web</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Whisp Mobile</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Premium</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Starter Kit</p>
                    </div>

                    <div className="w-[30%] flex flex-col justify-start items-center">
                        <p className="lg:text-[1.2vw] text-[0.95vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent lg:mb-[2vh] mb-[1.5vh]">Support</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">FAQ</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Feedback</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Terms of Use</p>
                        <p className="lg:text-[0.9vw] text-[0.8vh] bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent mb-[0.5vh]">Contact</p>
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center items-center lg:mt-[10vh] mt-[5vh]">
                    <p className="lg:text-[1.2vw] text-[0.95vh] font-medium bg-gradient-to-tl from-neutral-950 via-white/80 to-neutral-700 bg-clip-text text-transparent lg:mb-[2vh] mb-[1vh]">Follow Us</p>
                    <div className="flex justify-center items-center lg:gap-[4vh] gap-[2vh] lg:mt-[1vh] mt-[0.5vh]">
                        <img src={instagram} alt="insta-logo" className="lg:h-[3vh] h-[1.5vh] object-cover" />
                        <img src={discord} alt="discord-logo" className="lg:h-[3vh] h-[1.5vh] object-cover" />
                        <img src={github} alt="github-logo" className="lg:h-[3vh] h-[1.5vh] object-cover" />
                        <img src={twitter} alt="twitter-logo" className="lg:h-[3vh] h-[1.5vh] object-cover" />

                    </div>

                </div>

              </div>
            </div>

        </div>
      </div>
  )
}

export default LandingPage;
