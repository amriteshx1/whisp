
import { useState } from "react";
import loginAppLogo from "../assets/loginAppLogo.png";
import assets from "../assets/chat-app-assets/assets";

const LoginPage = () => {

  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(currentState == "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-auto">
        <div
          className="absolute inset-0 z-0 h-full w-full px-[5vh] py-[5vh]"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #90caff 100%)",
          }}
        >
            <div className="h-full bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col">
                {/* left-half */}
                <img src={loginAppLogo} alt="" className="h-[50vh]" />
        
                {/* right-half */}
                <form onSubmit={onSubmitHandler} className="border-2  text-zinc-700 ring-1 ring-sky-400 p-6 flex flex-col gap-6 rounded-lg">
                    <h2 className="font-medium text-2xl flex justify-between items-center">
                        {currentState}
                        {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" 
                        className="w-5 cursor-pointer" />}
                        
                    </h2>

                    {currentState === "Sign up" && !isDataSubmitted && (
                        <input onChange={(e)=> setFullName(e.target.value)} value={fullName}
                        type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400" placeholder="Full Name" required />
                    )}

                    {!isDataSubmitted && (
                        <>
                        <input onChange={(e)=> setEmail(e.target.value)} value={email}
                         type="email" placeholder="Email Address" required className="p-2 border border-gray-500
                         rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400"  />

                         <input onChange={(e)=> setPassword(e.target.value)} value={password}
                         type="password" placeholder="Password" required className="p-2 border border-gray-500
                         rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400"  />
                        </>
                    )}

                    {currentState === "Sign up" && isDataSubmitted && (
                      <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
                       rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400"
                      placeholder="Provide a short bio..." required></textarea>
                      )
                    }

                    <button type="submit" className="py-3 bg-gradient-to-r from-sky-400 to-sky-600 text-white rounded-md cursor-pointer">
                      {currentState === "Sign up" ? "Create Account" : "Login Now"}
                    </button>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <input type="checkbox" />
                      <p>Agree to the terms of use & privacy policy. </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {currentState === "Sign up" ? (
                        <p className="text-sm text-gray-600">Already have an account? <span onClick={()=>{setCurrentState("Login"); setIsDataSubmitted(false)}} className="font-medium text-sky-500 cursor-pointer">Login here</span></p>
                      ) : (
                        <p className="text-sm text-gray-600">Create an account <span onClick={()=>{setCurrentState("Sign up")}} className="font-medium text-sky-500 cursor-pointer">Click here</span></p>
                      )}

                    </div>

                </form>
      
            </div>

        </div>
    </div>
  )
}

export default LoginPage;
