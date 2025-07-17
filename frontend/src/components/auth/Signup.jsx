import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import {
  notify,
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
} from "./validation";

const backgroundImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1507208773393-40d9fc670acf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
];

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    PhoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  useEffect(() => {
    setBackgroundImage(
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    );
  }, []);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput((prevInput) => ({
        ...prevInput,
        file: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (
      !input.fullname ||
      !input.email ||
      !input.PhoneNumber ||
      !input.password
    ) {
      toast.error("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!validateEmail(input.email))
      return notify("error", "email is not correct format");
    if (!validatePassword(input.password))
      return notify("error", "Minimum 8 characters required");
    if (!validateName(input.name))
      return notify("error", "Please enter a name");
    if (!validatePhoneNumber(input.PhoneNumber))
      return notify("error", "atleast 10 digist required");

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("PhoneNumber", input.PhoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 bg-white text-purple-600 hover:bg-purple-100 transition-colors duration-300"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Left side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt="Office background"
        />
        <div className="absolute inset-0 bg-indigo-700 opacity-75"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-4">
            Join Our Professional Network
          </h2>
          <p className="text-xl mb-8 text-center">
            Connect with top employers and unlock your career potential
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-lg">
              <p className="text-2xl font-bold">1000+</p>
              <p>Job Listings</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-lg">
              <p className="text-2xl font-bold">500+</p>
              <p>Companies</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-lg">
              <p className="text-2xl font-bold">10k+</p>
              <p>Successful Hires</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-lg">
              <p className="text-2xl font-bold">24/7</p>
              <p>Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0 mt-8F">
        <div className="max-w-md w-full space-y-4 animate-fade-in-up">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Sign up and start your career journey
            </p>
          </div>
          <form
            className="bg-white shadow-xl rounded-lg p-6 space-y-4"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <div className="space-y-3">
              <div className="relative">
                <Label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm pl-10 transition duration-300 ease-in-out hover:border-purple-300"
                    placeholder="Full Name"
                    value={input.fullname}
                    onChange={changeEventHandler}
                  />
                  <User
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="relative">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm pl-10 transition duration-300 ease-in-out hover:border-purple-300"
                    placeholder="Email address"
                    value={input.email}
                    onChange={changeEventHandler}
                  />
                  <Mail
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="relative">
                <Label
                  htmlFor="PhoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="PhoneNumber"
                    name="PhoneNumber"
                    type="tel"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm pl-10 transition duration-300 ease-in-out hover:border-purple-300"
                    placeholder="Phone Number"
                    value={input.PhoneNumber}
                    onChange={changeEventHandler}
                  />
                  <Phone
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400"
                    size={16}
                  />
                </div>
              </div>
              <div className="relative">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm pl-10 pr-10 transition duration-300 ease-in-out hover:border-purple-300"
                    placeholder="Password"
                    value={input.password}
                    onChange={changeEventHandler}
                  />
                  <Lock
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-400"
                    size={16}
                  />
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
            </div>
            <div className="mt-3">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </Label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() =>
                    changeEventHandler({
                      target: { name: "role", value: "job_seeker" },
                    })
                  }
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
                    input.role === "job_seeker"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() =>
                    changeEventHandler({
                      target: { name: "role", value: "recruiter" },
                    })
                  }
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
                    input.role === "recruiter"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <div className="mt-3">
              <Label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
              </Label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="h-16 w-16 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-purple-500" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <label
                    htmlFor="file"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 ease-in-out flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2 text-purple-500" />
                    {input.file ? "Change Photo" : "Upload Photo"}
                  </label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                  />
                </div>
              </div>
              {input.file && (
                <p className="mt-2 text-xs text-gray-500">{input.file.name}</p>
              )}
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Please wait
                  </>
                ) : (
                  <>
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      size={16}
                    />
                    Sign up
                  </>
                )}
              </Button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-500 transition duration-150 ease-in-out underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
