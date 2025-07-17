import React, { Suspense, useRef, useState, useEffect, useMemo, useTransition } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float, Text, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Search, Briefcase, MapPin, DollarSign, Star, Users, FileText, Clock, CheckCircle, Book, Award, TrendingUp, ChevronRight, Building, MessageSquare, Bell, Shield, ChevronLeft } from 'lucide-react'
import Navbar from './shared/Navbar'
import Footer from './shared/footer'
import 'swiper/css'
import 'swiper/css/effect-cube'
import 'swiper/css/pagination'
import CountUp from 'react-countup'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const companyLogos = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Facebook', logo: 'https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg' },
  { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
  { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg' },
  { name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
];

const CompanyLogo = ({ company, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div className="w-40 h-24 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center">
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="max-w-full max-h-full object-contain p-4 filter grayscale hover:grayscale-0 transition-all duration-300"
        />
      </div>
      <p className="mt-4 text-gray-600 font-semibold">{company.name}</p>
    </motion.div>
  )
}

function JobBag() {
  const bagRef = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    bagRef.current.rotation.y = Math.sin(t / 2) * 0.1
  })

  return (
    <group ref={bagRef}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1.2, 2, 32]} />
        <MeshDistortMaterial color="#4A90E2" speed={2} distort={0.3} radius={1} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <torusGeometry args={[0.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#F5A623" />
      </mesh>
    </group>
  )
}

function FloatingIcons() {
  const iconsData = useMemo(() => [
    { position: [-1.2, 0.5, 0], color: "#50E3C2", text: "Resume" },
    { position: [1.2, 0.5, 0], color: "#FF6B6B", text: "Jobs" },
    { position: [0, 1.5, 0], color: "#4A90E2", text: "Search" },
    { position: [-0.8, -0.8, 0], color: "#FFD166", text: "Skills" },
    { position: [0.8, -0.8, 0], color: "#9B59B6", text: "Network" },
  ], [])

  return (
    <>
      {iconsData.map((icon, index) => (
        <Float key={index} speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <mesh position={icon.position} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial color={icon.color} speed={4} distort={0.5} radius={1} />
          </mesh>
          <Text
            position={[icon.position[0], icon.position[1] - 0.3, icon.position[2]]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {icon.text}
          </Text>
        </Float>
      ))}
    </>
  )
}

function Particles({ count = 500 }) {
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return positions
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#FFFFFF" sizeAttenuation transparent opacity={0.5} />
    </points>
  )
}

function JobPortalScene() {
  return (
    <group position={[0, -0.5, 0]}>
      <JobBag />
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        position={[0, 0.5, 0]}
      >
        <group>
          <mesh position={[-1.5, 1, 0]} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial color="#4A90E2" speed={2} distort={0.2} />
          </mesh>
          <mesh position={[1.5, 1, 0]} castShadow>
            <sphereGeometry args={[0.2, 32, 32]} />
            <MeshDistortMaterial color="#F5A623" speed={2} distort={0.2} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

const JobCard = ({ job }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
            {job.company[0]}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
            <p className="text-blue-600">{job.company}</p>
          </div>
        </div>
        {job.featured && (
          <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
            <Star size={12} className="mr-1" />
            Featured
          </span>
        )}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-2 text-blue-500" />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <DollarSign size={16} className="mr-2 text-green-500" />
          <span className="text-sm">{job.salary}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Briefcase size={16} className="mr-2 text-purple-500" />
          <span className="text-sm">{job.type}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-2 text-red-500" />
          <span className="text-sm">{job.posted}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">{job.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills && job.skills.map((skill, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {skill}
          </span>
        ))}
      </div>
      <button className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center">
        <FileText size={18} className="mr-2" />
        Apply Now
      </button>
    </motion.div>
  )
}

// Sample job listings data


const Fallback2DScene = () => (
  <div className="w-full h-full flex items-center justify-center bg-blue-100 rounded-lg">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-blue-600 mb-2">Job Portal</h3>
      <p className="text-blue-500">Connecting talent with opportunities</p>
    </div>
  </div>
)

const StatCard = ({ icon: Icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-xl p-6 text-center"
  >
    <Icon size={40} className="text-blue-600 mb-4 mx-auto" />
    <CountUp end={value} duration={2.5} separator="," className="text-3xl font-bold text-gray-800" />
    <p className="text-gray-600 mt-2">{label}</p>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-lg shadow-xl p-6"
  >
    <Icon size={40} className="text-blue-600 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const FloatingActionButton = () => (
  <motion.div
    className="fixed bottom-8 right-8 z-50"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  >
    <button
      className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors duration-300"
      onClick={() => {/* Implement quick job search functionality */}}
    >
      <Search size={24} />
    </button>
  </motion.div>
);



const RotatingSquare = ({ jobs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateLeft = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length);
  };

  const rotateRight = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length);
  };

  return (
    <div className="rotating-square-container">
      <button 
        onClick={rotateLeft} 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full z-10 hover:bg-blue-700 transition duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <div 
        className="rotating-square"
        style={{
          transform: `rotateY(${currentIndex * 90}deg)`,
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {jobs.map((job, index) => (
          <div key={job.id} className={`square-face square-face-${index + 1}`}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
      <button 
        onClick={rotateRight} 
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full z-10 hover:bg-blue-700 transition duration-300"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const Home = () => {

  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user?.role) {
      startTransition(() => {
        switch(user.role) {
          case 'recruiter':
            navigate("/recruiter/companies");
            break;
          case 'admin':
            navigate("/admin/dashboard");
            break;
          default:
            // For job seekers or other roles, stay on home page
            break;
        }
      });
    }
  }, [user?.role, navigate]);

  const [webGLAvailable, setWebGLAvailable] = useState(true)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    setWebGLAvailable(
      !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    )
  }, [])

  const stats = [
    { icon: Users, value: 100000, label: "Job Seekers" },
    { icon: Briefcase, value: 50000, label: "Jobs Posted" },
    { icon: Building, value: 10000, label: "Companies" },
    { icon: CheckCircle, value: 75000, label: "Successful Hires" },
  ];

  const features = [
    { icon: Search, title: "Advanced Job Search", description: "Find the perfect job with our powerful search tools." },
    { icon: FileText, title: "Resume Builder", description: "Create a professional resume with our easy-to-use builder." },
    { icon: Bell, title: "Job Alerts", description: "Get notified about new job opportunities that match your preferences." },
    { icon: MessageSquare, title: "Interview Coaching", description: "Prepare for interviews with our AI-powered coaching sessions." },
    { icon: TrendingUp, title: "Career Insights", description: "Get valuable insights into job market trends and salary information." },
    { icon: Shield, title: "Verified Employers", description: "Apply with confidence to jobs from verified employers." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
       <main className="flex-grow">
        {/* New Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-gradient"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]"></div>
            </div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mt-20 xl:mt-0">
              {/* Left Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="inline-block">
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium">
                      #1 Job Portal Platform
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                    <span className="text-white">Find Your</span>
                    <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Dream Career
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-blue-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Connect with leading companies and unlock opportunities that match your expertise and aspirations.
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12">
                    {[
                      { number: "20K+", label: "Active Jobs" },
                      { number: "50K+", label: "Companies" },
                      { number: "100K+", label: "Job Seekers" }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                      >
                        <div className="text-4xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-blue-200">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Content - 3D Scene */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="h-[400px] lg:h-[600px] w-full relative"
                >
                  {webGLAvailable ? (
                    <Canvas 
                      shadows 
                      camera={{ position: [0, 2, 5], fov: 50 }}
                      className="rounded-xl"
                      style={{ background: 'transparent' }}
                    >
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <spotLight 
                          position={[10, 10, 10]} 
                          angle={0.15} 
                          penumbra={1} 
                          shadow-mapSize={[512, 512]} 
                          castShadow 
                          intensity={1.5}
                        />
                        <JobPortalScene />
                        <OrbitControls 
                          enableZoom={false} 
                          autoRotate 
                          autoRotateSpeed={0.5}
                          maxPolarAngle={Math.PI / 2}
                          minPolarAngle={Math.PI / 3}
                        />
                        <Environment preset="city" />
                      </Suspense>
                    </Canvas>
                  ) : (
                    <Fallback2DScene />
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Wave SVG */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 70C840 80 960 100 1080 110C1200 120 1320 120 1380 120H1440V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" 
                fill="white"
                className="opacity-95"
              />
            </svg>
          </div>
        </section>

        {/* Keep all your existing sections below */}
        {/* ... rest of your code ... */}

      </main>

        {/* Enhanced Companies Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of companies that rely on our platform to find top talent
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 justify-items-center"
            >
              {companyLogos.map((company, index) => (
                <CompanyLogo key={company.name} company={company} index={index} />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center mt-16"
            >
            </motion.div>
          </div>
        </section>


        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Users, title: "Create an Account", description: "Sign up and complete your profile to showcase your skills and experience." },
                { icon: Search, title: "Search Jobs", description: "Browse through thousands of job listings or use our advanced search to find the perfect match." },
                { icon: FileText, title: "Apply with Ease", description: "Submit your application with just a few clicks and track your application status." }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <step.icon size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Categories Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Popular Job Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                "Technology", "Healthcare", "Finance", "Education",
                "Marketing", "Design", "Sales", "Engineering"
              ].map((category, index) => (
                <motion.a
                  key={index}
                  href={`/jobs/${category.toLowerCase()}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{category}</h3>
                  <p className="text-blue-600">View Jobs</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12">
              Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "John Doe", role: "Software Engineer", company: "TechCorp", quote: "I found my dream job through this platform. The process was smooth and efficient!" },
                { name: "Jane Smith", role: "Marketing Manager", company: "GrowthCo", quote: "The quality of job listings and the user-friendly interface made my job search a breeze." },
                { name: "Alex Johnson", role: "Data Scientist", company: "AI Innovations", quote: "I appreciate how easy it was to showcase my skills and connect with top employers in my field." }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white text-gray-800 p-6 rounded-lg shadow-xl"
                >
                  <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xl font-bold text-white mr-4">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-blue-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Resources Section */}
        {/* <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Career Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Book, title: "Resume Writing Tips", description: "Learn how to craft a compelling resume that stands out to employers." },
                { icon: TrendingUp, title: "Interview Preparation", description: "Get expert advice on how to ace your job interviews and land your dream role." },
                { icon: Award, title: "Career Development", description: "Explore resources to help you grow professionally and advance your career." }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-100 p-6 rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <resource.icon size={24} className="text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <a href="#" className="text-blue-600 font-semibold hover:underline">Learn More</a>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step in Your Career?</h2>
            <p className="text-xl mb-8">Join thousands of professionals who have found their dream jobs through our platform.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-blue-50 transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Create an Account
              </a>
              <a href="/find-jobs" className="bg-yellow-400 text-blue-800 font-semibold py-3 px-8 rounded-full hover:bg-yellow-300 transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Start Your Job Search
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Our Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              What Sets Us Apart
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section> */}

        {/* Featured Jobs Section */}
        {/* <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Featured Jobs
            </h2>
            <div className="flex justify-center items-center h-[400px] relative">
              <RotatingSquare jobs={featuredJobs} />
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  )
}

export default Home