// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setAuthChecked(true);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  if (!authChecked) return null; // or loading spinner

  return children;
}
