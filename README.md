# Whisp

An end-to-end messaging experience - crafted from scratch with **Socket.IO** & **WebRTC** at its core.  
Whisp makes real-time communication seamless, combining chat, media sharing, and audio/video calls in one place.  

---

## ✨ Features

- 🤝 **Friend System** – Add friends & connect instantly  
- 💬 **Real-time Messaging** – Smooth one-to-one conversations  
- 🎥 **Audio/Video Calls** – Built with WebRTC for seamless communication  
- 📎 **Media Sharing** – Share images, files, and more  
- ⌨️ **Typing Indicators** – Know when someone’s typing  
- 👀 **Read Receipts** – Message seen/delivered tracking  
- 🤖 **Smart Chatbot** – AI-powered conversations  
- ⚡ **Live Presence** – See who’s online instantly  
- 🔒 **Authentication & Security** – JWT & OAuth (Google)  
- ☁️ **Cloud Storage** – Media uploads with Cloudinary  

---

## 🛠️ Tech Stack

### Real-time Communication
- Socket.IO – Real-time messaging, signaling for WebRTC
- WebRTC – Peer-to-peer audio & video calls

### Frontend
- React (TypeScript, Vite)  
- TailwindCSS + Framer Motion  
- React Hot Toast for notifications  
- Socket.IO Client for real-time updates  
- React Router DOM for navigation  

### Backend
- Node.js + Express (TypeScript)  
- MongoDB with Mongoose  
- Authentication with JWT + Passport (Google OAuth2)  
- Socket.IO for real-time messaging  
- Cloudinary for media storage  
- Bcrypt.js for password hashing  
- CORS + Dotenv for environment configuration  

---

## 📂 Project Structure

```bash
whisp/
│── frontend/ # React + Vite + TailwindCSS client
│── backend/ # Node.js + Express + MongoDB API
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/whisp.git
cd whisp
```

### 2. Backend Setup
```bash
cd backend
npm install
```

- Create a .env file inside backend/ with:

  ```bash
  PORT=5000
  MONGO_URI=your_mongodb_connection
  JWT_SECRET=your_jwt_secret
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  GOOGLE_CALLBACK_URL=your_google_callback_url
  FRONTEND_URL=your_frontend_url
  GEMINI_API_KEY=your_gemini_api_key
  ```

- Start backend:
  ```bash
  npm run dev
  ```

---

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

- Create a .env file inside frontend/ with:

  ```bash
  VITE_BACKEND_URL=your_backend_url
  ```

- Start frontend:
  ```bash
  npm run dev
  ```

---

## 🚀 Usage

- Sign up or log in (supports Google OAuth).
- Add friends & start real-time conversations.
- Send messages, share files, and make audio/video calls.
- Enjoy extra features like typing indicators, read receipts, and chatbot support.

---

## 🤝 Contributing

- Contributions are welcome! Feel free to fork the repo and submit a PR.

---

## 📜 License

- This project is licensed under the MIT License.

---

 ## 🌐 Connect

- Built with ❤️ by Amritesh.