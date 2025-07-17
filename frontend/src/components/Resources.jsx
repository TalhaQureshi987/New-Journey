import React from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/footer'
import { motion } from 'framer-motion'
import { FileText, Video, Book, Briefcase, Users, TrendingUp, Award, Globe, Star, Zap } from 'lucide-react'

const resourceCategories = [
  {
    title: 'Job Search Essentials',
    icon: <Briefcase className="w-10 h-10 text-blue-500" />,
    resources: [
      { title: 'Resume Writing Masterclass', type: 'Video', link: 'https://www.youtube.com/watch?v=Tt08KmFfIYQ' },
      { title: 'Cover Letter Templates', type: 'Template', link: 'https://novoresume.com/career-blog/cover-letter-templates' },
      { title: 'Job Search Strategies Guide', type: 'eBook', link: 'https://www.indeed.com/career-advice/finding-a-job/successful-job-search-strategies' },
    ],
  },
  {
    title: 'Interview Preparation',
    icon: <Users className="w-10 h-10 text-green-500" />,
    resources: [
      { title: 'Top 50 Interview Questions and Answers', type: 'Article', link: 'https://www.glassdoor.com/blog/common-interview-questions/' },
      { title: 'Mock Interview Simulator', type: 'Interactive', link: 'https://www.pramp.com/' },
      { title: 'Body Language in Interviews', type: 'Video', link: 'https://www.youtube.com/watch?v=PCWVi5pAa30' },
    ],
  },
  {
    title: 'Career Development',
    icon: <TrendingUp className="w-10 h-10 text-purple-500" />,
    resources: [
      { title: 'Personal Branding Masterclass', type: 'Webinar', link: 'https://www.coursera.org/learn/personal-branding' },
      { title: 'Networking Strategies Podcast', type: 'Podcast', link: 'https://careercontent.libsyn.com/the-art-of-networking' },
      { title: 'Career Planning Workbook', type: 'PDF', link: 'https://www.monster.com/career-advice/article/career-planning-workbook' },
    ],
  },
  {
    title: 'Industry Insights',
    icon: <Globe className="w-10 h-10 text-red-500" />,
    resources: [
      { title: 'Tech Industry Trends 2024', type: 'Report', link: 'https://www.gartner.com/en/articles/gartner-top-10-strategic-technology-trends-for-2023' },
      { title: 'Healthcare Career Paths', type: 'Infographic', link: 'https://www.rasmussen.edu/degrees/health-sciences/blog/healthcare-career-paths/' },
      { title: 'Finance Industry Overview', type: 'Podcast', link: 'https://www.bloomberg.com/podcasts/masters_in_business' },
    ],
  },
];

const ResourceTypeIcon = ({ type }) => {
  switch (type) {
    case 'Video':
      return <Video className="w-5 h-5 text-red-500" />;
    case 'eBook':
    case 'PDF':
      return <Book className="w-5 h-5 text-green-500" />;
    case 'Article':
      return <FileText className="w-5 h-5 text-blue-500" />;
    default:
      return <Award className="w-5 h-5 text-purple-500" />;
  }
};

const featuredResources = [
  { 
    title: 'Job Search Strategies for 2024', 
    type: 'Video', 
    link: 'https://www.youtube.com/watch?v=uG2aEh5xBJE'
  },
  { 
    title: 'Mastering Remote Work', 
    type: 'Video', 
    link: 'https://www.youtube.com/watch?v=61wdjr6gWpw' 
  },
  { 
    title: 'Salary Negotiation Tactics', 
    type: 'Article', 
    link: 'https://www.glassdoor.com/blog/guide/how-to-negotiate-your-salary/'
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.h1 
            className="text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Elevate Your Career
          </motion.h1>
          <motion.p
            className="text-2xl text-center max-w-3xl mx-auto text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover a wealth of resources to propel your professional journey forward.
          </motion.p>
        </div>
      </div>
      <main className="flex-grow -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="bg-white rounded-lg shadow-xl p-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <Zap className="w-10 h-10 text-yellow-500 mr-3" />
              Featured Resources
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <li key={resource.title} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <a 
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center"
                  >
                    <ResourceTypeIcon type={resource.type} />
                    <span className="mt-3 font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors duration-200">{resource.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <motion.div 
                key={category.title}
                className="bg-white rounded-lg shadow-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-6">
                  {category.icon}
                  <h2 className="text-2xl font-bold text-gray-800 ml-4">{category.title}</h2>
                </div>
                <ul className="space-y-4">
                  {category.resources.map((resource) => (
                    <li key={resource.title}>
                      <a 
                        href={resource.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        <ResourceTypeIcon type={resource.type} />
                        <span className="ml-3 text-lg">{resource.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Resources