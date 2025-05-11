import { useState } from 'react';
import { X } from 'lucide-react';
import { redirectToCheckout } from '../../services/stripe';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscribeModal = ({ isOpen, onClose }: SubscribeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);
      await redirectToCheckout('K9_KOMPARE');
    } catch (err) {
      setError('Failed to initiate checkout. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6">Upgrade to Premium</h2>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">
            Get access to all premium features for just $4.99/month
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-lg">Premium Features Include:</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Genetic Health Risk Comparison
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Personality Match Test
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Bark-O-Meter with Sound Clips
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Video Clips of Breeds
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Maintenance Cost Calculator
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Growth Tracker Tool
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Save & Download Comparisons
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
              Local Rescue Lookup
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <button 
            className="btn btn-primary w-full mb-4 relative"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </span>
                <span className="opacity-0">Subscribe Now - $4.99/month</span>
              </>
            ) : (
              'Subscribe Now - $4.99/month'
            )}
          </button>
          <p className="text-sm text-gray-500">
            Cancel anytime. 3-day free trial included.
          </p>
        </div>
      </div>
    </div>
  );
};