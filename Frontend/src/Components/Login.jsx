import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogInBtn";

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log(result);
        localStorage.setItem('token', result.token);
        navigate("/home");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-2 border rounded" required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border rounded" required
                    />

                    <input type="submit" value="Login" className="mb-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" />
                    <GoogleLogin />
                </form>
                <Link className="text-blue-600" to="/">Create Account</Link>
            </div>
        </div>
    );
}
