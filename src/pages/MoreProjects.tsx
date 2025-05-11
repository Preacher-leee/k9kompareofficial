import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const MoreProjects = () => {
  const projects = [
    {
      title: "PawfectMatch",
      description: "AI-powered dog breed recommendation platform",
      url: "https://pawfectmatch.com"
    },
    {
      title: "DoggyDaycare",
      description: "Pet daycare management system",
      url: "https://doggydaycare.app"
    },
    {
      title: "BarkBuddy",
      description: "Social network for dog owners",
      url: "https://barkbuddy.social"
    }
  ];

  return (
    <motion.div 
      className="pt-24 pb-16 min-h-screen bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">More Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="card p-6 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-3">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-500 hover:text-primary-600"
              >
                Visit Project <ExternalLink size={16} className="ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoreProjects;