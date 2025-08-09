import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/chat-app-assets/assets";
import appLogo from "../assets/appLogo.jpg";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

    const {authUser, updateProfile} = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState<File | null>(null);
    const navigate = useNavigate();
    const [name, setName] = useState(authUser?.fullName || "");
    const [bio, setBio] = useState(authUser?.bio || "");

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!selectedImg){
          await updateProfile({fullName: name, bio});
          navigate('/home');
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedImg);
        reader.onload = async() => {
          const base64Image = reader.result;
          if (typeof base64Image === "string") {
            await updateProfile({ profilePic: base64Image, fullName: name, bio });
            navigate('/home');
          }
        }
    }


  return (
    <div className="min-h-screen w-full bg-black relative overflow-auto">
        <div
          className="absolute inset-0 z-0 h-full w-full px-[5vh] py-[5vh]"
        >
            <div className="h-full bg-cover bg-no-repeat flex items-center justify-center">
                <div className="w-5/6 max-w-2xl text-white/85 border-t-2 border-l-2 border-neutral-800  flex items-center justify-between max-sm:flex-col-reverse rounded-4xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                        <h3 className="text-2xl font-medium">Profile details</h3>
                        <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer text-neutral-500 hover:text-neutral-400">
                            <input onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setSelectedImg(file);
                            }} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />

                            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-10 h-10 ${selectedImg && 'rounded-full'}`} />
                            Upload new profile image
                        </label>
                        <input onChange={(e)=>setName(e.target.value)} value={name}
                         type="text" required placeholder="Your name" className="p-2 border border-neutral-700 text-neutral-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600" />
                        <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
                        placeholder="Write profile bio" required className="p-2 border border-neutral-700 text-neutral-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-600" rows={4}></textarea>
                        <p className="text-sm text-neutral-700">◾ Friend Code: <span className="text-neutral-600">{authUser?.friendCode}</span></p>
                        <p className="text-sm text-neutral-700">◾ Email: <span className="text-neutral-600">{authUser?.email}</span></p>
                        <button type="submit" className="bg-gradient-to-tl from-neutral-950 via-white/10 to-neutral-700 text-white/75 hover:text-white/90 rounded-xl  p-2 text-lg cursor-pointer" >Save</button>
                    </form>
                    <img src={authUser?.profilePic || appLogo} alt="" className={`max-w-48 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} />
                </div>
            </div>

        </div>
    </div>
  )
}

export default ProfilePage
