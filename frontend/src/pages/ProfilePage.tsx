import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/chat-app-assets/assets";
import appLogo from "../assets/appLogo.png";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

    const {authUser, updateProfile} = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState(authUser.fullName);
    const [bio, setBio] = useState(authUser.bio);

    const handleSubmit = async(e) =>{
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
          await updateProfile({profilePic: base64Image, fullName: name, bio});
          navigate('/home');
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
            <div className="h-full bg-cover bg-no-repeat flex items-center justify-center">
                <div className="w-5/6 max-w-2xl text-gray-300 border-2 ring-1 ring-sky-400  flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                        <h3 className="text-lg text-zinc-700 font-medium">Profile details</h3>
                        <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer text-zinc-500">
                            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
                            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
                            Upload profile image
                        </label>
                        <input onChange={(e)=>setName(e.target.value)} value={name}
                         type="text" required placeholder="Your name" className="p-2 border border-gray-500 text-zinc-600 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400" />
                        <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
                        placeholder="Write profile bio" required className="p-2 border border-gray-500 text-zinc-600 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-400" rows={4}></textarea>
                        
                        <button type="submit" className="bg-gradient-to-r from-sky-400 to-sky-600 text-white p-2 rounded-full text-lg cursor-pointer" >Save</button>
                    </form>
                    <img src={authUser?.profilePic || appLogo} alt="" className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} />
                </div>
            </div>

        </div>
    </div>
  )
}

export default ProfilePage
