import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  useEffect(() => {
    // You could trigger any post-purchase actions here
  }, []);

  return (
    <motion.div 
      className="pt-24 pb-16 min-h-screen bg-cream flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your payment was successful and your account has been upgraded to premium.
            </p>
            <div className="space-y-4">
              <Link 
                to="/compare" 
                className="btn btn-primary block w-full md:w-auto md:inline-block"
              >
                Start Comparing Breeds
              </Link>
              <Link 
                to="/account" 
                className="btn btn-outline block w-full md:w-auto md:inline-block md:ml-4"
              >
                View Account Details
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                <span>Access to all premium features is now unlocked</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                <span>You can now save and download breed comparisons</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-1" />
                <span>Detailed health insights and training resources are available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Success;