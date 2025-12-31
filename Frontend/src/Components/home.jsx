import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token')
    alert("Logged out Successfully")
    navigate("/login")
  }

  return (
    <div className="h-screen bg-black flex-col gap-4 items-center justify-center">
      <h2 className="text-3xl text-red-500 flex items-center justify-center">Welcome you are Signed In Successfully</h2>
      <button className="text-white bg-blue-500 px-4 p-2 rounded-xl flex items-center justify-center" onClick={()=>navigate("/profile") }>Profile</button>
      <button className="text-white bg-red-500 px-4 p-2 rounded-xl flex items-center justify-center" onClick={handleLogout}>LogOut</button>
    </div>
  )
}

export default Home
