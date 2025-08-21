import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import assets from "../assets/chat-app-assets/assets";
import appLogo from "../assets/appLogo.jpg";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

    const {authUser, updateProfile} = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState<File | null>(null);
    const navigate = useNavigate();
    const [name, setName] = useState(authUser?.fullName || "");
    const [bio, setBio] = useState(authUser?.bio || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        setIsSubmitting(true);
        try{
          if(!selectedImg){
            await updateProfile({fullName: name, bio});
            navigate('/home');
            return;
          }
  
          const reader = new FileReader();
          reader.readAsDataURL(selectedImg);
          reader.onload = async() => {
            try {
              const base64Image = reader.result;
              if (typeof base64Image === "string") {
                await updateProfile({ profilePic: base64Image, fullName: name, bio });
                navigate("/home");
              }
            } finally {
              setIsSubmitting(false);
            }
          };
        }catch(err){
          console.log(err);
          setIsSubmitting(false);
        }
    };


  return (
    <div className="h-screen w-full bg-[radial-gradient(ellipse_at_bottom_left,#022c22,#000000,#000000)] bg-cover relative overflow-auto lg:px-[5vh] lg:py-[5vh] px-[2vh] py-[2vh]">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} 
              className="h-full flex lg:flex-row flex-col items-center justify-center">
                <div className="md:w-5/6 w-[95%] max-w-2xl text-white/85 border-t-2 border-l-2 border-neutral-800  flex items-center justify-between max-sm:flex-col-reverse rounded-4xl">
                    <form onSubmit={handleSubmit} className="flex flex-col md:gap-5 gap-4 md:p-10 p-5 flex-1">
                        <h3 className="lg:text-2xl text-xl font-medium">Profile details</h3>
                        <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer text-neutral-500 hover:text-neutral-400">
                            <input onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedImg(file);
                            }} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />

                            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="new-profilePic" className={`w-10 h-10 ${selectedImg && 'rounded-full'}`} />
                            Upload new profile image
                        </label>
                        <input onChange={(e)=>setName(e.target.value)} value={name}
                         type="text" required placeholder="Your name" className="p-2 border border-neutral-700 text-neutral-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600" />
                        <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
                        placeholder="Write profile bio" required className="p-2 border border-neutral-700 text-neutral-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600" rows={4}></textarea>
                        <p className="text-sm text-neutral-700">◾ Friend Code: <span className="text-neutral-600">{authUser?.friendCode}</span></p>
                        <p className="text-sm text-neutral-700">◾ Email: <span className="text-neutral-600">{authUser?.email}</span></p>
                        <button type="submit" disabled={isSubmitting} className="flex justify-center items-center bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75 hover:text-white/90 rounded-xl  lg:p-2 p-1 lg:text-lg text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                          "Save"
                        )}
                        </button>
                    </form>
                    <img src={authUser?.profilePic || appLogo} alt="user-profilePic" className={`md:max-w-48 max-w-28 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} />
                </div>
                <p onClick={() => {navigate("/home")}} className="lg:hidden text-xs text-white/85 flex justify-start items-center gap-2 mt-[5vh]"><img src={assets.arrow} alt="back-arrow" className="w-6 h-6" />Back to home</p>
            </motion.div>
    </div>
  )
}

export default ProfilePage
