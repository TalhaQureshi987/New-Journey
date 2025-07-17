import React, { useState } from "react";
import { FaLinkedin, FaGithub, FaTwitter, FaBriefcase, FaGraduationCap, FaCamera } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Pen, Calendar, Plus, FileText, Download, Building2, MapPin } from "lucide-react";
import ProfileDetails from "./ProfileDetails";
import { useSelector } from "react-redux";
import Navbar from "../shared/Navbar";

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate) return '';
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let duration = '';
  const totalMonths = years * 12 + months;
  
  if (totalMonths >= 12) {
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    duration = `${y} ${y === 1 ? 'year' : 'years'}`;
    if (m > 0) duration += ` ${m} ${m === 1 ? 'month' : 'months'}`;
  } else {
    duration = `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
  }
  
  return duration;
};

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [editType, setEditType] = useState("");
  const [itemIndex, setItemIndex] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const skills = user?.skills || [];

  const ProfileHeader = () => (
    <div className="relative mb-32 sm:mb-40 w-full">
      <div className="h-80 sm:h-96 w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>

      <div className="absolute -bottom-24 sm:-bottom-32 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm bg-white/90">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={user?.profilepicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white 
                           shadow-lg object-cover transition-transform duration-300 
                           group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 
                             group-hover:opacity-100 transition-opacity duration-200 
                             flex items-center justify-center cursor-pointer">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 
                             bg-gradient-to-r from-purple-600 to-pink-600 
                             inline-block text-transparent bg-clip-text">
                  {user?.fullname || "Unknown User"}
                </h1>
                <p className="mt-2 text-gray-600 max-w-2xl">
                  {user?.bio || "No bio available."}
                </p>
                
                <div className="flex justify-center sm:justify-start mt-4 space-x-4">
                  <SocialLinks user={user} />
                </div>
              </div>

              <button
                onClick={() => {
                  setEditType("profile");
                  setOpen(true);
                }}
                className="absolute top-4 right-4 p-2 sm:px-4 sm:py-2 rounded-lg 
                         bg-white/90 hover:bg-white text-purple-600 shadow-md 
                         hover:shadow-lg transition-all duration-200 
                         flex items-center gap-2 group"
              >
                <Pen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline group-hover:translate-x-0.5 
                               transition-transform duration-200">
                  Edit Profile
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileInfo = () => (
    <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-8 
                  hover:shadow-xl transition-all duration-300">
      <div className="space-y-6">
        <ContactInfo user={user} />
        <ResumeSection user={user} />
        <SkillsSection skills={skills} />
      </div>
    </div>
  );

  const InfoItem = ({ icon, label, value, isEmail }) => (
    <div className="flex items-center gap-3 group p-3 rounded-lg 
                  hover:bg-gray-50 transition-all duration-200 
                  hover:shadow-md cursor-default">
      <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 
                    rounded-lg text-white shadow-md group-hover:shadow-lg 
                    transition-all duration-200 group-hover:scale-105">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-gray-800 font-medium truncate 
                     ${isEmail ? 'select-all cursor-text' : ''}`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  const SocialLinks = ({ user }) => {
    const socialLinks = [
      {
        icon: FaLinkedin,
        url: user?.sociallinks?.linkedin,
        color: "text-blue-600",
        hoverColor: "hover:text-blue-700",
        label: "LinkedIn"
      },
      {
        icon: FaGithub,
        url: user?.sociallinks?.github,
        color: "text-gray-800",
        hoverColor: "hover:text-gray-900",
        label: "GitHub"
      },
      {
        icon: FaTwitter,
        url: user?.sociallinks?.twitter,
        color: "text-blue-400",
        hoverColor: "hover:text-blue-500",
        label: "Twitter"
      }
    ];

    return (
      <>
        {socialLinks.map((social, index) => {
          if (!social.url) return null;
          const Icon = social.icon;
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`${social.color} ${social.hoverColor} p-2 rounded-full 
                       bg-gray-50 hover:bg-gray-100 shadow-md hover:shadow-lg 
                       transform hover:-translate-y-1 transition-all duration-200`}
            >
              <Icon size={20} />
            </a>
          );
        })}
      </>
    );
  };

  const ContactInfo = ({ user }) => (
    <div className="space-y-4">
      <InfoItem
        icon={<MdEmail className="w-5 h-5" />}
        label="Email"
        value={user?.email}
        isEmail
      />
      <InfoItem
        icon={<MdPhone className="w-5 h-5" />}
        label="Phone"
        value={user?.PhoneNumber}
      />
      <InfoItem
        icon={<MapPin className="w-5 h-5" />}
        label="Location"
        value={user?.location}
      />
    </div>
  );

  const ResumeSection = ({ user }) => (
    <div className="pt-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Resume</h2>
      {user?.resume ? (
        <a
          href={user.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg 
                   hover:bg-gray-100 text-purple-600 transition-colors duration-200"
        >
          <FileText className="w-5 h-5" />
          <span className="flex-1 truncate">{user.resumeOriginalName || "View Resume"}</span>
          <Download className="w-5 h-5" />
        </a>
      ) : (
        <p className="text-gray-500 italic">No resume available</p>
      )}
    </div>
  );

  const SkillsSection = ({ skills }) => (
    <div className="pt-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 
                       text-white rounded-full text-sm font-medium shadow-sm 
                       hover:shadow-md transition-shadow duration-200"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-500 italic">No skills listed</span>
        )}
      </div>
    </div>
  );

  const EducationSection = () => (
    <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-8 
                  hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <FaGraduationCap className="w-5 h-5 text-purple-500" />
          Education
        </h2>
        {user?.education?.length > 0 && (
          <button
            onClick={() => {
              setEditType("education");
              setItemIndex(null);
              setOpen(true);
            }}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 
                     rounded-lg hover:bg-purple-100 transition-all duration-200 
                     flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Education</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {user?.education?.length > 0 ? (
          user.education.map((edu, index) => (
            <div key={index} className="relative group">
              <div className="p-4 sm:p-6 rounded-xl bg-gray-50 
                           group-hover:bg-purple-50/50 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {edu.degree}
                    </h3>
                    <p className="text-purple-600 font-medium">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Class of {edu.year}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditType("education");
                      setItemIndex(index);
                      setOpen(true);
                    }}
                    className="p-2 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-200 bg-white rounded-lg 
                             shadow-md hover:shadow-lg"
                  >
                    <Pen className="w-4 h-4 text-purple-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No education listed yet"
            action={() => {
              setEditType("education");
              setItemIndex(null);
              setOpen(true);
            }}
            actionLabel="Add Education"
          />
        )}
      </div>
    </div>
  );

  const ExperienceSection = () => (
    <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 mb-8 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <FaBriefcase className="w-5 h-5 text-purple-500" />
          Experience
        </h2>
        {user?.experience?.length > 0 && (
          <button
            onClick={() => {
              setEditType("experience");
              setItemIndex(null);
              setOpen(true);
            }}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 
                     rounded-lg hover:bg-purple-100 transition-all duration-200 
                     flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Experience</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {user?.experience?.length > 0 ? (
          user.experience.map((exp, index) => (
            <div key={index} className="relative group">
              <div className="p-4 sm:p-6 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 
                            transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {exp.jobTitle}
                        </h3>
                        <p className="text-purple-600 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditType("experience");
                          setItemIndex(index);
                          setOpen(true);
                        }}
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity 
                                 duration-200 bg-white rounded-lg shadow-md hover:shadow-lg"
                      >
                        <Pen className="w-4 h-4 text-purple-500" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-purple-600 font-medium">
                        {calculateDuration(exp.startDate, exp.endDate)}
                      </span>
                    </div>

                    <p className="mt-3 text-gray-600 whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center 
                          justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-gray-500 mb-4">No experience listed yet</p>
            <button
              onClick={() => {
                setEditType("experience");
                setItemIndex(null);
                setOpen(true);
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                       transition-colors duration-200 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const EmptyState = ({ title, action, actionLabel }) => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center 
                    justify-center mx-auto mb-4">
        <Plus className="w-8 h-8 text-purple-500" />
      </div>
      <p className="text-gray-500 mb-4">{title}</p>
      <button
        onClick={action}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg 
                 hover:bg-purple-700 transition-colors duration-200 
                 inline-flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {actionLabel}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full">
        <ProfileHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProfileInfo />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <ExperienceSection />
              <EducationSection />
            </div>
          </div>
        </div>
      </div>

      {open && (
        <ProfileDetails
          open={open}
          setOpen={setOpen}
          type={editType}
          item={editType === "experience" ? user.experience[itemIndex] : 
               editType === "education" ? user.education[itemIndex] : null}
          index={itemIndex}
        />
      )}
    </div>
  );
};

export default Profile;
