import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { subscribeToNewsletter } from '../../services/dogApi';

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenNewsletterPopup');
    if (!hasSeenPopup) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenNewsletterPopup', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setSuccess(true);
        localStorage.setItem('hasSeenNewsletterPopup', 'true');
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 m-4">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-primary-600 mb-2">Thank You!</h2>
            <p className="text-gray-600">You've successfully subscribed to our newsletter.</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">Subscribe to Our Newsletter!</h2>
            <p className="text-gray-600 text-center mb-6">
              Get weekly dog facts, breed comparisons, and care tips delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Subscribe Now
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};