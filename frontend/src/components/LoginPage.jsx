import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser } from "../utility/api";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword"; // import the component

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loginMessage, setLoginMessage] = useState("");
  const [loginMessageColor, setLoginMessageColor] = useState("green");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (data) => {
    setLoginMessage("");
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };

      const response = await loginUser(loginData);

      localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000);

      setLoginMessage("Login successful!");
      setLoginMessageColor("green");

      await new Promise(resolve => setTimeout(resolve, 100));
    
    // Then navigate
    navigate("/dashboard");
    } catch (error) {
      setLoginMessage("Error: Invalid email or password.");
      setLoginMessageColor("red");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl min-h-[550px] bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-700 flex">
        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-br from-blue-200 to-blue-50 text-center p-10 flex items-center justify-center">
          <div>
            <h1 className="text-5xl font-extrabold text-blue-900 mb-2">
              Aara Infraa
            </h1>
            <p className="text-lg text-blue-700 font-medium mb-4">
              Crafting Elegance with Premium UPVC Windows
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <form onSubmit={handleSubmit(onLogin)} className="w-full max-w-md bg-white p-8">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Sign In</h2>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Please enter a valid email address",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-1 w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)} // Triggering the modal
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md"
            >
              Log In
            </button>

            {/* Login Message */}
            {loginMessage && (
              <p className={`text-sm mt-3 text-${loginMessageColor}-500 text-center`}>
                {loginMessage}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
  <ForgotPassword onClose={() => setShowForgotPassword(false)} />
)}
    </div>
  );
}
