import { createContext, useContext, useRef, useState } from "react";

const CallContext = createContext(null);

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const peerConnection = useRef(null);
  const otherUserSocketId = useRef(null);

  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        callActive,
        peerConnection,
        setLocalStream,
        setRemoteStream,
        setCallActive,
        otherUserSocketId,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
