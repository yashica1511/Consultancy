import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const expiryTime = localStorage.getItem("tokenExpiry");

      if (!token || !user) {
        console.error("Missing auth data");
        navigate("/");
        return;
      }

      try {
        console.log("Verifying authentication...");
        await axios.get("http://localhost:5000/api/protected", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setIsVerified(true);
      } catch (err) {
        console.error("Authentication failed:", err);
        localStorage.clear();
        navigate("/");
      }
    };

    verifyAuth();
  }, [navigate]);

  // Render children only after verification
  return isVerified ? children : null;
};

export default ProtectedRoute;