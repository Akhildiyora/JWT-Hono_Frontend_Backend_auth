import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    
      const res = await fetch("http://localhost:3000/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/home");

  };

  return <div id="googleBtn"></div>;
}
