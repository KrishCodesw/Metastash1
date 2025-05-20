# SecondBrain Frontend

The **SecondBrain App** is a personal knowledge management system that allows users to collect, organize, and share content from various sources. This is the frontend built with **React (Vite)**, **TypeScript**, **Tailwind CSS**, and **Material UI**.

## 🚀 Project Overview

SecondBrain helps users curate and store tweets, YouTube videos, articles, links, and personal notes. The frontend provides a seamless UI for content management, tagging, searching, and sharing public read-only content pages.

## ✨ Features

- 🔐 User authentication (Sign up / Sign in)
- 📥 Save tweets, YouTube videos, links, and notes
- 🏷️ Tag content for better organization
- 🔍 Search content by keywords or tags
- 🧑‍💼 Personalized dashboard view
- 🔗 Share public read-only versions of saved content
- 💻 Fully responsive UI with Tailwind and MUI components

## 🛠 Tech Stack

- **React (Vite)**
- **TypeScript**
- **Tailwind CSS**
- **Material UI (MUI)**
- **Axios**

## ⚙️ Installation and Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/secondbrain-frontend.git
cd secondbrain-frontend
Install dependencies

bash
Copy
Edit
npm install
# or
yarn install
Run the development server

bash
Copy
Edit
npm run dev
# or
yarn dev
Update the environment variables

Create a .env file in the root directory and add:

env
Copy
Edit
VITE_API_URL=http://localhost:5000/api
📁 Folder Structure
arduino
Copy
Edit
secondbrain-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/       # Axios API calls
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── index.html
├── tailwind.config.js
└── vite.config.ts


📜 Available Scripts
npm run dev – Start the development server

npm run build – Build the production version

npm run preview – Preview the production build

🤝 Contribution Guidelines (optional)
We welcome contributions! Please fork the repo, create a feature branch, and submit a pull request with detailed information.


