import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { notify, validateEmail } from "./validation";

const backgroundImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
];

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading,user } = useSelector(store => store.auth);

  useEffect(() => {
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackgroundImage(randomImage);
  }, []);

  const validateForm = () => {
    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill out all fields.");
      return false;
    }
    // Additional validation logic here
    return true;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!validateEmail(input.email)) return notify('error', "Email is not in correct format");

    try {
        dispatch(setLoading(true));
        const response = await axios.post(`${USER_API_END_POINT}/login`, input, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        if (response.data.success) {
            // Check user status
            if (response.data.user.status === 'inactive') {
                toast.error("Your account is inactive. Please contact support for assistance.");
                return;
            }

            // If status is active, proceed with login
            dispatch(setUser(response.data.user));
            
            // Show appropriate welcome message
            const roleMessage = response.data.user.role === 'recruiter' 
                ? 'Welcome back, Recruiter!' 
                : 'Welcome back!';
            
            toast.success(roleMessage);
            navigate("/");
        }
    } catch (error) {
        console.error("Login failed:", error);
        
        // Handle different error scenarios
        if (error.response?.status === 401) {
            toast.error("Invalid email or password");
        } else if (error.response?.status === 403) {
            toast.error(error.response.data.message);
        } else if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error("Login failed. Please try again later.");
        }
    } finally {
        dispatch(setLoading(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-100 relative">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 bg-white text-purple-600 hover:bg-purple-100 transition-colors duration-300"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="max-w-md w-full space-y-8 animate-fade-in-up">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Log in to your account and explore new opportunities
            </p>
          </div>
          <form className="mt-8 space-y-6 bg-white shadow-2xl rounded-lg p-8" onSubmit={submitHandler}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative mb-4">
                <Label htmlFor="email" className="sr-only">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm pl-10 transition duration-300 ease-in-out hover:border-purple-300"
                  placeholder="Email address"
                  value={input.email}
                  onChange={changeEventHandler}
                />
                <Mail className="absolute top-3 left-3 text-purple-400" size={16} />
              </div>
              <div className="relative">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm pl-10 pr-10 transition duration-300 ease-in-out hover:border-purple-300"
                  placeholder="Password"
                  value={input.password}
                  onChange={changeEventHandler}
                />
                <Lock className="absolute top-3 left-3 text-purple-400" size={16} />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-purple-400 hover:text-purple-600 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-purple-400 hover:text-purple-600 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>


<div className="mt-3">
  <Label className="block text-sm font-medium text-gray-700 mb-2">Role</Label>
  <div className="flex space-x-4">
    <button
      type="button"
      onClick={() => changeEventHandler({ target: { name: 'role', value: 'job_seeker' } })}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
        input.role === 'job_seeker'
          ? 'bg-purple-600 text-white'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
    >
      Employee
    </button>
    <button
      type="button"
      onClick={() => changeEventHandler({ target: { name: 'role', value: 'recruiter' } })}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
        input.role === 'recruiter'
          ? 'bg-purple-600 text-white'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
    >
      Recruiter
    </button>
  </div>
</div>


            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Please wait
                  </>
                ) : (
                  <>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} />
                    Login
                  </>
                )}
              </Button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500 transition duration-150 ease-in-out underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-75"></div>
        <img 
          src={backgroundImage}
          alt="Job background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center px-8 animate-fade-in-up">
            <h2 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-pulse">
              Find Your Dream Job
            </h2>
            <p className="text-2xl mb-12 text-gray-200">Connect with top employers and unlock your potential</p>
            <div className="flex justify-center space-x-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
                <p className="text-3xl font-bold mb-2 text-white">1000+</p>
                <p className="text-lg text-blue-100">Job Listings</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
                <p className="text-3xl font-bold mb-2 text-white">500+</p>
                <p className="text-lg text-indigo-100">Companies</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
                <p className="text-3xl font-bold mb-2 text-white">10k+</p>
                <p className="text-lg text-purple-100">Successful Hires</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
