import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { setAllAdminJobs } from "@/redux/jobSlice";

const menuItems = ['Home', 'Jobs', 'Companies', 'Resources'];

const NavLink = ({ to, children, isActive, isScrolled }) => (
  <Link
    to={to}
    className={`relative overflow-hidden px-1 py-2 transition-colors duration-300 ${
      isActive
        ? 'text-blue-400 font-semibold'
        : 'text-gray-200 hover:text-blue-400'
    }`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100`}></span>
  </Link>
);

const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    className={`block py-2 text-lg font-medium text-center ${
      isActive ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispach = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispach(setUser(null));
        dispach(setAllAdminJobs()); 
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during logout.";
      toast.error(errorMessage);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 10);
    setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 100);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const renderLogo = useMemo(() => (
    <Link to={user?.role === 'recruiter' ? '/recruiter/jobs' : '/'} className="flex items-center space-x-2">
      <svg 
        className={`w-8 h-8 ${
          user?.role === 'recruiter'
            ? 'text-blue-400'
            : isMenuOpen
              ? 'text-gray-800'
              : isScrolled
                ? 'text-blue-600'
                : 'text-white'
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h1 className={`text-2xl font-bold ${
        user?.role === 'recruiter'
          ? 'text-white'
          : isMenuOpen
            ? 'text-gray-800'
            : isScrolled
              ? 'text-gray-800'
              : 'text-white'
      }`}>
        Job <span className={
          user?.role === 'recruiter'
            ? 'text-blue-400'
            : isMenuOpen
              ? 'text-blue-600'
              : isScrolled
                ? 'text-blue-600'
                : 'text-blue-300'
        }>Portal</span>
      </h1>
    </Link>
  ), [isMenuOpen, isScrolled, user]);

  const renderDesktopMenu = useMemo(() => (
    <ul className="hidden md:flex font-medium items-center space-x-6">
      {user && user.role === 'recruiter' ? (
        <>
          <NavLink 
            to="/recruiter/companies" 
            isActive={location.pathname === "/recruiter/companies"} 
            isScrolled={false} // Force light color scheme for recruiter
            className="text-gray-200 hover:text-blue-400 transition-colors duration-200"
          >
            Companies
          </NavLink>
          <NavLink 
            to="/recruiter/jobs" 
            isActive={location.pathname === "/recruiter/jobs"} 
            isScrolled={false} // Force light color scheme for recruiter
            className="text-gray-200 hover:text-blue-400 transition-colors duration-200"
          >
            Jobs
          </NavLink>
        </>
      ) : (
        menuItems.map((item) => (
          <NavLink
            key={item}
            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
            isActive={location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
            isScrolled={isScrolled}
          >
            {item}
          </NavLink>
        ))
      )}
    </ul>
  ), [user, location.pathname, isScrolled]);

  const renderAuthButtons = useMemo(() => (
    !user ? (
      <div className="hidden md:flex items-center space-x-2">
        <Link to="/login">
          <Button className={`transition-all duration-300 ${
            isScrolled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}>Login</Button>
        </Link>
        <Link to="/signup">
          <Button className={`transition-all duration-300 ${
            isScrolled
              ? 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>Signup</Button>
        </Link>
      </div>
    ) : (
      <div className="hidden md:flex items-center space-x-4">
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={user?.profilepicture || "https://via.placeholder.com/150"} alt="@shadcn" />
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            {user && user.role === 'recruiter' ? (
              <button onClick={logOutHandler} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded w-full text-left text-red-600">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                  <User2 size={18} />
                  <span>Profile</span>
                </Link>
                <Link to="/applyedjobs" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded">
                  <Briefcase size={18} />
                  <span>My Applications</span>
                </Link>
                <button onClick={logOutHandler} className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded w-full text-left text-red-600">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    )
  ), [user, isScrolled]);

  const renderMobileMenuButton = useMemo(() => (
    <button
      onClick={toggleMenu}
      className={`md:hidden ${
        isMenuOpen
          ? 'text-gray-800'
          : isScrolled
            ? 'text-gray-800 hover:text-blue-600'
            : 'text-white hover:text-blue-300'
      } focus:outline-none transition-colors duration-300`}
      aria-expanded={isMenuOpen ? "true" : "false"}
      aria-label="Toggle menu"
    >
      {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  ), [isMenuOpen, isScrolled]);

  const renderMobileMenu = useMemo(() => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.nav
          className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto px-4 pt-4">
            <div className="flex justify-between items-center">
              {renderLogo}
              {renderMobileMenuButton}
            </div>
            <ul className="mt-8 space-y-4">
              {user && user.role === 'recruiter' ? (
                <>
                  <MobileNavLink to="/recruiter/companies" isActive={location.pathname === "/recruiter/companies"} onClick={toggleMenu}>
                    Companies
                  </MobileNavLink>
                  <MobileNavLink to="/recruiter/jobs" isActive={location.pathname === "/recruiter/jobs"} onClick={toggleMenu}>
                    Jobs
                  </MobileNavLink>
                </>
              ) : (
                menuItems.map((item) => (
                  <MobileNavLink
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    isActive={location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                    onClick={toggleMenu}
                  >
                    {item}
                  </MobileNavLink>
                ))
              )}
              {/* Only show Profile and My Applications if the user is logged in and is NOT a recruiter */}
              {user && user.role !== 'recruiter' && (
                <div className="space-y-2">
                  <MobileNavLink to="/profile" isActive={location.pathname === "/profile"} onClick={toggleMenu}>
                    Profile
                  </MobileNavLink>
                  <MobileNavLink to="/applyedjobs" isActive={location.pathname === "/applyedjobs"} onClick={toggleMenu}>
                    My Applications
                  </MobileNavLink>
                </div>
              )}
              {/* Show Login and Signup buttons if the user is NOT logged in */}
              {!user && (
                <div className="space-y-2">
                  <MobileNavLink to="/login" onClick={toggleMenu}>
                    Login
                  </MobileNavLink>
                  <MobileNavLink to="/signup" onClick={toggleMenu}>
                    Signup
                  </MobileNavLink>
                </div>
              )}
              {user && (
                <li className="pt-2">
                  <Button onClick={logOutHandler} className="w-full bg-red-600 text-white hover:bg-red-700">
                    Logout
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  ), [isMenuOpen, location.pathname, user]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          user && user.role === 'recruiter'
            ? isScrolled
              ? 'bg-slate-900 shadow-lg'
              : 'bg-slate-800'
            : isScrolled
              ? 'bg-white shadow-md'
              : 'bg-transparent'
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            {renderLogo}
          </div>
          <div className="flex gap-6 mr-7">
            {renderDesktopMenu}
            {renderAuthButtons}
          </div>

          {renderMobileMenuButton}
        </div>
      </motion.nav>
      {renderMobileMenu}
    </>
  );
};

export default Navbar;
