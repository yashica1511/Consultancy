import { useForm } from "react-hook-form";
import { useState } from "react";
import { loginUser, registerUser } from "../utility/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState("");
  const [loginMessageColor, setLoginMessageColor] = useState("green");

  const [registerMessage, setRegisterMessage] = useState("");
  const [registerMessageColor, setRegisterMessageColor] = useState("green");
  const [passwordFocus, setPasswordFocus] = useState(false);

  // Separate forms
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm();

  const {
    register: regRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm();

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const onLogin = async (data) => {
    setLoginMessage("");
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };
      const response = await loginUser(loginData);
  
      // Assuming response has a token and user
      const token = response.token;
  
      const expiryTime = Date.now() + 60 * 60 * 1000; // current time + 1 hour
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("tokenExpiry", expiryTime);
  
      setLoginMessage("Login successful!");
      setLoginMessageColor("green");
  
      resetLogin();
  
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setLoginMessage("Error: Invalid email or password.");
      setLoginMessageColor("red");
    }
  };
  

  const onRegister = async (data) => {
    setRegisterMessage("");
    if (data.password !== data.confirmPassword) {
      setRegisterMessage("Passwords do not match");
      setRegisterMessageColor("red");
      return;
    }
    try {
      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      const response = await registerUser(registerData);
      console.log("Register Data:", response);
      setRegisterMessage("Registration successful!");
      setRegisterMessageColor("green");
      resetRegister();
      setTimeout(() => {
        setIsRegister(false);
        setRegisterMessage("");
      }, 2000);
    } catch (error) {
      setRegisterMessage("Error: User already exists.");
      setRegisterMessageColor("red");
    }
  };


  const checkPasswordRules = (password) => {
    const validations = {
      length: password.length >= 6 && password.length <= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password),
    };
    setPasswordValidations(validations);
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl min-h-[550px] bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-700 flex">
        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-br from-blue-200 to-blue-50 text-center p-10 flex items-center justify-center">
          <div>
            <h1 className="text-5xl font-extrabold text-blue-900 mb-2">Aara Infraa</h1>
            <p className="text-lg text-blue-700 font-medium mb-4">
              Crafting Elegance with Premium UPVC Windows
            </p>
          </div>
        </div>

        {/* Right Forms */}
        <div className="w-1/2 relative overflow-hidden">
          <div
            className={`flex w-[200%] transition-transform duration-700 ${
              isRegister ? "-translate-x-1/2" : ""
            }`}
          >
            {/* LOGIN FORM */}
            <div className="w-1/2 flex items-center justify-center p-10">
              <form onSubmit={handleLoginSubmit(onLogin)} className="w-full max-w-md bg-white p-8">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Sign In</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...loginRegister("email", {
                      required: "Please enter a valid email address",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your email"
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{loginErrors.email.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    {...loginRegister("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your password"
                  />
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md"
                >
                  Log In
                </button>

                {loginMessage && (
                  <p className={`text-sm mt-3 text-${loginMessageColor}-500 text-center`}>{loginMessage}</p>
                )}

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?
                    <button
                      type="button"
                      onClick={() => setIsRegister(true)}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* REGISTER FORM */}
            <div className="w-1/2 flex items-center justify-center p-10">
              <form onSubmit={handleRegisterSubmit(onRegister)} className="w-full max-w-md bg-white p-8">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Register</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...regRegister("name", { required: "Name is required" })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your name"
                  />
                  {registerErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.name.message}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...regRegister("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your email"
                  />
                  {registerErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.email.message}</p>
                  )}
                </div>

                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                        {...regRegister("password", {
                          required: "Password must be between 6–12 characters",
                          validate: (value) => {
                            const isValid = 
                              /[a-z]/.test(value) &&
                              /[A-Z]/.test(value) &&
                              /[0-9]/.test(value) &&
                              /[^A-Za-z0-9]/.test(value) &&
                              value.length >= 6 && value.length <= 12;
                            return isValid || "Password does not meet all requirements";
                          }
                        })}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        onChange={(e) => {
                          regRegister("password").onChange(e);
                          checkPasswordRules(e.target.value);
                        }}
                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                        placeholder="Create a password"
                      />
                      {registerErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{registerErrors.password.message}</p>
                      )}

                      {passwordFocus && (
                        <div className="mt-2 text-sm">
                          <p className={`${passwordValidations.length ? "text-green-600" : "text-red-500"}`}>• 6–12 characters</p>
                          <p className={`${passwordValidations.lowercase ? "text-green-600" : "text-red-500"}`}>• At least one lowercase letter</p>
                          <p className={`${passwordValidations.uppercase ? "text-green-600" : "text-red-500"}`}>• At least one uppercase letter</p>
                          <p className={`${passwordValidations.number ? "text-green-600" : "text-red-500"}`}>• At least one number</p>
                          <p className={`${passwordValidations.specialChar ? "text-green-600" : "text-red-500"}`}>• At least one special character</p>
                        </div>
                      )}
                    </div>


                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    {...regRegister("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    placeholder="Confirm password"
                  />
                  {registerErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md"
                >
                  Register
                </button>

                {registerMessage && (
                  <p className={`text-sm mt-3 text-${registerMessageColor}-500 text-center`}>{registerMessage}</p>
                )}

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?
                    <button
                      type="button"
                      onClick={() => setIsRegister(false)}
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
