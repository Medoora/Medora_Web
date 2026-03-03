<div align="center">
  <img width="1300" src="./public/logo/medora-full.png" alt="MEDORA Banner" />
  <p>Secure • Organized • User-Controlled Healthcare Data</p>
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38BDF8?style=for-the-badge&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase)
<br/>
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)
![OpenAI](https://img.shields.io/badge/OpenAI-000000?style=for-the-badge&logo=openai)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend)
![Gemini](https://img.shields.io/badge/Gemini-1A73E8?style=for-the-badge&logo=google)
![AI%20SDK](https://img.shields.io/badge/AI%20SDK-4F46E5?style=for-the-badge)

</div>

---

# 🏠 Home Page Preview

<div align="center">
  <img src="./public/dark.png" alt="MEDORA Dark Mode" />
</div>

---

# 🤝 Looking for Indie Developers & Builders

🚀 **Building MEDORA in public** and actively looking for **indie developers** who want to collaborate, learn, and ship something meaningful together.

If you're interested in:
- 🧑‍💻 Web development
- ⚛️ React / Next.js
- 🔐 Auth, storage & system design
- 🩺 Health-tech with real-world impact

You're very welcome here.

👉 Open an issue, start a discussion, or reach out via GitHub.  
Let's build, break, and learn together 🌱

**#indiedev #indiehacker #opensource #buildinpublic #nextjs #healthtech**

---

# ✨ About MEDORA

**MEDORA** is an early-stage medical technology platform designed to simplify how people store and manage their medical data.

Think of MEDORA as a **personal health drive** 📂  
where users can securely store medical records and apply for insurance—all from one platform.

---

# 🚀 Vision

Healthcare data today is scattered, hard to access, and rarely user-controlled.

MEDORA aims to:
- 🔐 **Give users full ownership** of their medical data  
- 📁 **Centralize health records** securely  
- 🛡️ **Simplify insurance access**  
- ⚡ **Make healthcare data usable and accessible**

---

# 🏗️ System Architecture

MEDORA follows a **secure, scalable, and modular architecture** ensuring privacy-first healthcare data management.

<div align="left">
  <img src="./public/system-architecture/system-architecture.png" alt="System Architecture Diagram" width="720"/>
  <br />
  <em>High-level system architecture of MEDORA</em>
</div>

### 🔁 Architecture Overview
- 🖥️ **Client (Next.js App)** handles UI and user interactions  
- 🔐 **Firebase Auth** manages secure authentication  
- 📦 **Firestore** stores user metadata and document references  
- ☁️ **Cloudinary** securely stores medical files  
- ▲ **Vercel** enables fast global deployment  

---

# 📤 File Upload Process

The upload flow is designed to ensure **security, validation, and real-time availability**.

<div align="left">
  <img src="./public/system-architecture/file-upload.png" alt="File Upload Process Diagram" width="720"/>
  <br />
  <em>Medical document upload workflow</em>
</div>

### 🔄 Upload Flow
1. 👤 User selects a medical document  
2. 🧪 Client-side validation (type & size)  
3. ☁️ Secure upload to Cloudinary  
4. 🆔 Metadata stored in Firestore  
5. 🔄 Real-time sync to dashboard  

---

# 💡 Key Features

### 📂 Medical Data Storage
Upload reports, prescriptions, and medical history like a cloud drive.

### 🔐 Privacy-First Architecture
User-controlled access and secure handling of sensitive data.

### 🛡️ Insurance Integration
Apply for medical insurance directly from MEDORA.

### 🧾 Clean Record Organization
Structured and searchable health records.

### 🌓 Dark / Light Mode
Seamless theme switching with persistent user preference.

### 📱 Responsive Design
Optimized for desktop, tablet, and mobile devices.

### 🔄 Real-time Updates
Instant synchronization across all devices.

---

# 🛠️ Tech Stack

<div align="left">

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15 (App Router), TypeScript, React 19 |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons |
| **Authentication** | Firebase Auth (Email, OTP, Google OAuth) |
| **Database** | Firestore (NoSQL, real-time sync) |
| **Storage** | Cloudinary (Images & PDFs) |
| **State** | React Context, Custom Hooks |
| **Deployment** | Vercel, Edge Functions |
| **Analytics** | Google Analytics, Error Tracking |

</div>

---

# 🧪 Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/medora.git

# Navigate into the project
cd medora

# Install dependencies
npm install

# Start development server
npm run dev
