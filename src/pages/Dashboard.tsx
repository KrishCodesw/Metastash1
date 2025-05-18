"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import toast, { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

import {
  Plus,
  LogOut,
  Edit2,
  Trash2,
  X,
User,
  Copy,
  Save,
  LinkIcon,
  Type,
  Grid,
  List,
  Search,
  ChevronRight,
  ChevronLeft,
  Database,
} from "lucide-react"

interface Content {
  _id: string
  type: string
  link: string
  title: string
  tags: string[]
  sharedUrl:string
}

const Dashboard = () => {
  const [username, setUsername] = useState("")
  const [isSharingEnabled, setIsSharingEnabled] = useState(false);
  const [savedContent, setSavedContent] = useState<Content[]>([])
  const [newContent, setNewContent] = useState({ title: "", type: "", link: "", tags: "" })
  const [editContent, setEditContent] = useState<Content | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")



  const fetchSavedContent = async () => {
    try {
      const res = await fetch("https://metabackf.onrender.com/api/v1/content", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSavedContent(data)
      
      
    } catch (err) {
      toast.error("Failed to fetch content")
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/signin")
      return
    }

    const verifyTokenAndFetch = async () => {
      try {
        const decoded: any = jwtDecode(token)
               
        
        setUsername(decoded.username)
        setIsSharingEnabled(decoded.isSharingEnabled); 
        console.log({isSharingEnabled})
       
        await fetchSavedContent()
      } catch (err) {
        toast.error("Invalid token")
        navigate("/signin")
      }
    }

    verifyTokenAndFetch()
  }, [token, navigate])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(username);
      
      const res = await fetch("https://metabackf.onrender.com/api/v1/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newContent,
          tags: newContent.tags.split(",").map((tag) => tag.trim()),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSavedContent([...savedContent, data.content])
        setNewContent({ title: "", type: "", link: "", tags: "" })
        toast.success("Content added!")
        setIsAddOpen(false)
      }
    } catch (err) {
      toast.error("Add failed")
    }
  }




  const goToProfile = () => {
    navigate("/profile/:id")
  }


  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return
    try {
      const res = await fetch(`https://metabackf.onrender.com/api/v1/content/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setSavedContent(savedContent.filter((item) => item._id !== id))
        toast.success("Deleted")
      }
    } catch (err) {
      toast.error("Delete failed")
    }
  }

  const handleEditSave = async () => {
    if (!editContent) return
    try {
      const res = await fetch(`https://metabackf.onrender.com/api/v1/content/${editContent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editContent.title,
          type: editContent.type,
          link: editContent.link,
          tags: editContent.tags,
        }),
      })

      if (res.ok) {
        fetchSavedContent()
        setEditContent(null)
        setIsEditOpen(false)
        toast.success("Content updated!")
      }
    } catch (err) {
      toast.error("Update failed")
    }
  }

  // const handleLinkClick = (event:React.MouseEvent<HTMLAnchorElement>, linkType:string) => {
  //   // Check if it's the X link and apply Option 3 behavior
  //   if (linkType === "X") {
  //     event.preventDefault(); // Prevent default link behavior for X link
  //     console.log("X link clicked, applying Option 3 behavior");
  //     // Insert your Option 3 code here (for example, change state, redirect, etc.)
      
  //   }
  //   // For other links, normal behavior happens automatically
  // };
  








  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    navigate("/signin")
  }

  const filteredContent = savedContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const tagVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  // Custom cursor
  // const cursorX = useTransform(mouseX, (value) => value - 16)
  // const cursorY = useTransform(mouseY, (value) => value - 16)
  // const cursorSize = useMotionValue(32)
  // const cursorOpacity = useMotionValue(0)

  // useEffect(() => {
  //   const handleMouseEnter = () => {
  //     cursorOpacity.set(0.2)
  //   }
  //   const handleMouseLeave = () => {
  //     cursorOpacity.set(0)
  //   }
  //   document.addEventListener("mouseenter", handleMouseEnter)
  //   document.addEventListener("mouseleave", handleMouseLeave)
  //   return () => {
  //     document.removeEventListener("mouseenter", handleMouseEnter)
  //     document.removeEventListener("mouseleave", handleMouseLeave)
  //   }
  // }, [cursorOpacity])

  // Gradient background
  const gradientBg = "linear-gradient(135deg, #0f172a 0%, #020617 100%)"

  return (
    <motion.div className="min-h-screen text-white relative overflow-hidden" style={{ background: gradientBg }}>
      {/* Custom cursor */}
      {/* <motion.div
        className="fixed rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: cursorSize,
          height: cursorSize,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          opacity: cursorOpacity,
        }}
      /> */}

      {/* Animated background elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500 opacity-10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [Math.random() * 0.5 + 0.5, Math.random() * 1 + 1, Math.random() * 0.5 + 0.5],
          }}
          transition={{
            duration: Math.random() * 60 + 60,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            filter: "blur(40px)",
          }}
        />
      ))}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            border: "1px solid #444",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      {/* Mobile Topbar */}
      <motion.header
        className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-md py-4 px-4 sm:hidden flex justify-between items-center border-b border-gray-800 fixed top-0 left-0 right-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      >
        <motion.h2
          className="text-xl font-bold text-blue-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          MetaStash
        </motion.h2>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center text-sm"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add
          </motion.button>
          <motion.button
          onClick={() => goToProfile()}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full  rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <User className="w-full" />
     
  
        </motion.button>
          <motion.button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center text-sm"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </motion.button>
        </div>
      </motion.header>

      {/* Sidebar for Desktop */}
      <motion.aside
        className="w-64 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md py-8 px-4 fixed top-0 left-0 h-full  flex-col space-y-8 border-r border-gray-800 hidden sm:flex z-40"
        variants={sidebarVariants}
        initial="open"
        animate={sidebarOpen ? "open" : "closed"}
      >
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-xl font-bold text-blue-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            MetaStash
          </motion.h2>
          <motion.button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        </div>

        <motion.div
          className="flex flex-col space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Dashboard</p>
          <motion.div
            className="flex items-center space-x-2 text-gray-300 bg-gray-800 bg-opacity-50 p-2 rounded-md"
            whileHover={{ backgroundColor: "rgba(30, 58, 138, 0.3)" }}
          >
            <Database className="h-4 w-4" />
            <span>All Content</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">View</p>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => setViewMode("grid")}
              className={`flex items-center space-x-2 p-2 rounded-md ${viewMode === "grid" ? "bg-blue-900 text-white" : "text-gray-400 hover:text-white"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid className="h-4 w-4" />
              <span>Grid</span>
            </motion.button>
            <motion.button
              onClick={() => setViewMode("list")}
              className={`flex items-center space-x-2 p-2 rounded-md ${viewMode === "list" ? "bg-blue-900 text-white" : "text-gray-400 hover:text-white"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Content
        </motion.button>
        <motion.button
          onClick={() => goToProfile()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <User className="h-5 w-5 mr-2" />
     Profile
  
        </motion.button>

        <motion.button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center mt-auto"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </motion.button>
      </motion.aside>

      {/* Sidebar toggle button when closed */}
      {!sidebarOpen && (
        <motion.button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 bg-black bg-opacity-50 p-2 rounded-md text-white hidden sm:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      )}

      {/* Main Content */}
      <motion.main
        className={`flex-1 py-8 px-8 ${sidebarOpen ? "sm:ml-64" : "sm:ml-0"} overflow-y-auto flex flex-col items-center sm:pt-0 pt-16 transition-all duration-300 ease-in-out min-h-screen`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h1
              className="text-3xl font-bold mb-4 md:mb-0 text-blue-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Content Vault
            </motion.h1>

            <motion.div
              className="relative w-full md:w-64"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isSearchFocused ? "text-blue-400" : "text-gray-400"}`}
              />
              <motion.input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 bg-black bg-opacity-50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {filteredContent.length === 0 && (
              <motion.div
                className="flex flex-col items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-gray-500 text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-xl">No content found</p>
                  <p className="text-sm mt-2">Add some content or try a different search term</p>
                </motion.div>
                <motion.button
                  onClick={() => setIsAddOpen(true)}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Content
                </motion.button>
                <motion.button
          onClick={() => goToProfile()}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <User className="h-5 w-5 mr-2" />
     Profile
  
        </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                : "flex flex-col space-y-4 w-full"
            }
          >
            <AnimatePresence>
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  className={`
  relative overflow-hidden
  ${
    viewMode === "grid"
      ? "bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 p-5 hover:border-blue-500/30 transition-all duration-200"
      : "bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 p-4 hover:border-blue-500/30 transition-all duration-200"
  }
`}
                  style={{
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  }}
                >
                  {/* Glow effect on hover */}
                  {/* <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20 opacity-0 transition-opacity duration-300 rounded-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  /> */}

                  <motion.h3
                    className="text-lg font-semibold mb-2 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {item.title}
                    
                  </motion.h3>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  
                    className="  z-10 text-blue-400 text-sm break-words hover:underline mb-2 flex items-center"
                   
                   
                  >
                    <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Link to {item.type}</span>
                  </a>

                  <motion.p
                    className="text-sm text-blue-300 mb-3 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Type className="h-3 w-3 mr-1 flex-shrink-0" />
                    {item.type}
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-2 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    {item.tags.map((tag, idx) => (
                      <motion.span
                        key={idx}
                        {...tagVariants}
                        className="inline-block bg-blue-600 text-white text-xs rounded-full px-2 py-1 font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx, duration: 0.2 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}

<motion.button
    onClick={() => {
      navigator.clipboard.writeText(item.sharedUrl || item.link);
      toast.success("Link copied!");
      // alert("Link copied!");
    }}
    className="inline-block bg-transparent  text-xs rounded-full font-medium cursor-pointer"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.2 }}
  >
  <Copy/>
  </motion.button>

  

                  </motion.div>

                  <motion.div
                    className="absolute top-2 right-2 flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <motion.button
                      onClick={() => {
                        setEditContent(item)
                        setIsEditOpen(true)
                      }}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors duration-150 ease-in-out bg-black bg-opacity-50 rounded-full p-1.5"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-400 transition-colors duration-150 ease-in-out bg-black bg-opacity-50 rounded-full p-1.5"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsAddOpen(false)}
            />
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-xl p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <motion.h2
                    className="text-xl font-semibold text-white"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Add New Content
                  </motion.h2>
                  <motion.button
                    onClick={() => setIsAddOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter title"
                      value={newContent.title}
                      onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <input
                      type="text"
                      placeholder="Enter type"
                      value={newContent.type}
                      onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link</label>
                    <input
                      type="text"
                      placeholder="Enter link"
                      value={newContent.link}
                      onChange={(e) => setNewContent({ ...newContent, link: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Enter tags"
                      value={newContent.tags}
                      onChange={(e) => setNewContent({ ...newContent, tags: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div
                    className="flex justify-end mt-6 gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Save className="h-4 w-4 mr-2 inline-block" />
                      Add
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && editContent && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsEditOpen(false)}
            />
            <motion.div
              className="fixed z-50 inset-0 flex items-center justify-center pointer-events-none"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-xl p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <motion.h2
                    className="text-xl font-semibold text-white"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Edit Content
                  </motion.h2>
                  <motion.button
                    onClick={() => setIsEditOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-150"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleEditSave()
                  }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={editContent.title}
                      onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <input
                      type="text"
                      value={editContent.type}
                      onChange={(e) => setEditContent({ ...editContent, type: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Link</label>
                    <input
                      type="text"
                      value={editContent.link}
                      onChange={(e) => setEditContent({ ...editContent, link: e.target.value })}
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={editContent.tags.join(",")}
                      onChange={(e) =>
                        setEditContent({ ...editContent, tags: e.target.value.split(",").map((tag) => tag.trim()) })
                      }
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div
                    className="flex justify-end mt-6 gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setIsEditOpen(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Save className="h-4 w-4 mr-2 inline-block" />
                      Save
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Dashboard
