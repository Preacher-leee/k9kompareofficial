import { useAuthStore } from '../../stores/authStore';
import { Lock } from 'lucide-react';

interface PremiumBannerProps {
  onSignIn: () => void;
  onSubscribe: () => void;
}

export const PremiumBanner = ({ onSignIn, onSubscribe }: PremiumBannerProps) => {
  const { user, isPremium } = useAuthStore();

  if (isPremium) return null;

  return (
    <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg mb-6">
      <div className="flex items-start">
        <Lock className="text-primary-500 mt-1 mr-3" size={20} />
        <div>
          <h3 className="font-semibold text-primary-700">
            {user ? 'Upgrade to Premium' : 'Sign in to access premium features'}
          </h3>
          <p className="text-primary-600 mt-1">
            {user
              ? 'Get access to advanced breed comparisons, health insights, and more.'
              : 'Create an account to unlock premium features and save your comparisons.'}
          </p>
          <button
            onClick={user ? onSubscribe : onSignIn}
            className="btn btn-primary mt-3"
          >
            {user ? 'Upgrade Now' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};