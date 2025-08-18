
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import appLogo from "../assets/appLogo.jpg";
import assets from "../assets/chat-app-assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {

  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(currentState == "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
    try{
      setLoading(true);
      await login(currentState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio});
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative bg-black overflow-auto">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} 
              className="h-full bg-cover bg-center flex lg:flex-row flex-col items-center lg:justify-around justify-center lg:gap-0 gap-[10vh]">
                {/* left-half */}
                <img src={appLogo} alt="whisp-logo" className="lg:h-[70vh] h-[30vh]" />
        
                {/* right-half */}
                <form onSubmit={onSubmitHandler} className="lg:border-t-2 lg:border-r-0 lg:border-b-0 border-b-2 border-r-2 border-l-2 border-neutral-800  text-white/85 p-6 flex flex-col gap-4 lg:rounded-4xl rounded-2xl">
                    <h2 className="font-medium lg:text-3xl text-2xl flex justify-between items-center">
                        {currentState}
                        {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="back-arrow" 
                        className="w-5 cursor-pointer" />}
                        
                    </h2>

                    {currentState === "Sign up" && !isDataSubmitted && (
                        <input onChange={(e)=> setFullName(e.target.value)} value={fullName}
                        type="text" className="p-2 border border-neutral-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600 text-neutral-400 placeholder-neutral-500" placeholder="Full Name" required />
                    )}

                    {!isDataSubmitted && (
                        <>
                        <input onChange={(e)=> setEmail(e.target.value)} value={email}
                         type="email" placeholder="Email Address" required className="p-2 border border-neutral-700
                         rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600 text-neutral-400 placeholder-neutral-500"  />

                         <input onChange={(e)=> setPassword(e.target.value)} value={password}
                         type="password" placeholder="Password" required className="p-2 border border-neutral-700
                         rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600 text-neutral-400 placeholder-neutral-500"  />
                        </>
                    )}

                    {currentState === "Sign up" && isDataSubmitted && (
                      <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
                       rows={4} className="p-2 border border-neutral-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600 text-neutral-400"
                      placeholder="Provide a short bio..." required></textarea>
                      )
                    }

                    <button type="submit" disabled={loading} className="p-2 flex justify-center items-center bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75 hover:text-white/90 rounded-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : currentState === "Sign up" ? (
                        "Create Account"
                      ) : (
                        "Login Now"
                      )}
                    </button>
                    <p className="text-xs text-center font-semibold text-neutral-500 my-[-0.75rem]">Or</p>

                    <button
                      type="button"
                      onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`}
                      className="p-2 flex justify-center items-center gap-2 bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75 hover:text-white/90 rounded-xl cursor-pointer"
                    >
                      <img src={assets.google} alt="google" className="w-5 h-5" />Continue with Google
                    </button>

                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <input type="checkbox" className="accent-neutral-700" required />
                      <p>Agree to the terms of use & privacy policy. </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {currentState === "Sign up" ? (
                        <p className="text-sm text-neutral-600">Already have an account? <span onClick={()=>{setCurrentState("Login"); setIsDataSubmitted(false)}} className="font-medium text-neutral-500 cursor-pointer hover:text-neutral-400">Login here</span></p>
                      ) : (
                        <p className="text-sm text-neutral-600">Create an account <span onClick={()=>{setCurrentState("Sign up")}} className="font-medium text-neutral-500 cursor-pointer hover:text-neutral-400">Click here</span></p>
                      )}

                    </div>

                </form>
      
            </motion.div>
    </div>
  )
}

export default LoginPage;
