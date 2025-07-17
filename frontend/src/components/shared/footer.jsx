import React, { useTransition } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Admin Login', path: '/admin/login' }
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com/jobportal' },
    { icon: Twitter, url: 'https://twitter.com/jobportal' },
    { icon: Linkedin, url: 'https://linkedin.com/company/jobportal' }
  ];

  const contactInfo = [
    { icon: MapPin, text: '123 Job Street, Career City, State 12345', url: 'https://maps.google.com' },
    { icon: Mail, text: 'info@jobportal.com', url: 'mailto:info@jobportal.com' },
    { icon: Phone, text: '(123) 456-7890', url: 'tel:+11234567890' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0 transform hover:translate-y-[-5px] transition-transform duration-300">
            <Link to="/" className="inline-block">
              <h3 className="text-2xl font-bold mb-4 text-white hover:text-[#697565] transition-colors duration-300">
                JobPortal
              </h3>
            </Link>
            <p className="text-sm text-white/80 mb-6">
              Find your dream job or the perfect candidate. Connecting top talent with leading companies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#697565] transition-colors duration-300 transform hover:scale-110"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/4 mb-8 md:mb-0 transform hover:translate-y-[-5px] transition-transform duration-300">
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="text-sm space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index} className="transform hover:translate-x-2 transition-transform duration-300">
                  <button 
                    onClick={() => handleNavigation(link.path)}
                    className={`text-white/80 hover:text-[#697565] transition-colors duration-300 ${
                      link.name === 'Admin Login' ? 'font-medium' : ''
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="w-full md:w-1/4 transform hover:translate-y-[-5px] transition-transform duration-300">
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <address className="text-sm text-white/80 not-italic space-y-2">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center transform hover:translate-x-2 transition-transform duration-300 hover:text-[#697565]"
                >
                  <item.icon size={16} className="mr-2 text-white" />
                  <span>{item.text}</span>
                </a>
              ))}
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/60">
          <p>
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.{' '}
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer