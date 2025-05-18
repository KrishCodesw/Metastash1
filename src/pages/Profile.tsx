import { useNavigate } from "react-router-dom"
const Profile = () => {
    const navigate = useNavigate();

  // Dummy user data (replace with actual fetched data)
  const user = {
    name: "DevPals",
    email: "devpals@example.com",
    bio: "Building smart web experiences. Passionate about AI, dev tools, and design.",
    location: "Jaipur, India",
    joined: "Jan 2024",
    avatar: "https://ui-avatars.com/api/?name=Dev+Pals&background=0D8ABC&color=fff",
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-3xl mx-auto bg-[#0f172a] rounded-2xl shadow-lg p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />

          {/* User Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-400">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="mt-3 text-sm text-gray-300">{user.bio}</p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400">
              <span>📍 {user.location}</span>
              <span>📅 Joined {user.joined}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-700" />

        {/* Additional Actions / Settings */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            Edit Profile
          </button>
          <button className="border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
            Manage Sharing
          </button>
          <button
  onClick={() => navigate("/dashboard/:id")}
  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
>
  ← Back to Dashboard
</button>

        </div>
      </div>
    </div>
  )
}

export default Profile
