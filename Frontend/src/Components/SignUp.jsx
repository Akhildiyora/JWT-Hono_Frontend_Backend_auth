import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleLogin from './GoogleLogInBtn';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        age: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/create", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(formData),
        })

        const result = await response.json();
        console.log(result)
        // localStorage.setItem('token', result.token);
        alert(result.message)
        navigate("/login")

    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="w-full px-3 py-2 rounded-md bg-transparent border-2 border-zinc-800 outline-none"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange} required
                    />

                    <input
                        className="w-full px-3 py-2 rounded-md bg-transparent border-2 border-zinc-800 outline-none"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange} required
                    />

                    <input
                        className="w-full px-3 py-2 rounded-md bg-transparent border-2 border-zinc-800 outline-none"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange} required
                    />

                    <input
                        className="px-3 py-2 rounded-md bg-transparent border-2 border-zinc-800 outline-none"
                        type="number"
                        placeholder="age"
                        name="age"
                        onChange={handleChange} required
                    />

                    <input type="submit" value="Create User" className="mb-4 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700" />
                    <GoogleLogin />
                </form>
                <Link className="text-blue-600" to="/login">Login Here</Link>
            </div>
        </div>
    );
}
