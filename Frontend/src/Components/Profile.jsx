import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');  
      const response = await fetch('http://localhost:3000/profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`},
        });
        if(response.status === 401){
            navigate("/login")
        }
        const data = await response.json();
        setUser(data.user);
    };
    fetchProfile();
  }, []);

  return (
    <div className="h-screen text-white bg-black flex-col gap-4 items-center justify-center">
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Age:</strong> {user?.age}</p>
            <Link className="text-white bg-red-500 px-4 p-2 rounded-xl flex items-center justify-center" to="/home">Back to Home</Link>
    </div>
  );
};

export default Profile;
