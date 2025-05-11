import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';

const Cancel = () => {
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
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Purchase Cancelled</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your purchase was cancelled and you haven't been charged.
            </p>
            <div className="space-y-4">
              <Link 
                to="/" 
                className="btn btn-primary flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft size={20} />
                Return to Homepage
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you encountered any issues or have questions about our premium features, 
              we're here to help.
            </p>
            <a 
              href="mailto:support@k9kompare.com"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cancel;