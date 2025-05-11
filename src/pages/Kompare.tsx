import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  Info, 
  PawPrint, 
  Heart,
  Scale,
  Clock,
  Brain,
  Dumbbell,
  Scissors,
  MessageSquare,
  Baby,
  Dog,
  Award,
  Share2
} from 'lucide-react';
import { useDog } from '../context/DogContext';

// Rating component for visual comparison
const RatingBar = ({ value, max = 5, color = "primary" }: { value: number; max?: number; color?: "primary" | "secondary" }) => (
  <div className="flex items-center gap-1">
    {[...Array(max)].map((_, i) => (
      <div 
        key={i} 
        className={`h-2 w-4 rounded ${i < value 
          ? `bg-${color}-500` 
          : 'bg-gray-200'}`}
      />
    ))}
  </div>
);

const Compare = () => {
  const { 
    breeds, 
    loading, 
    error, 
    selectedBreeds, 
    breedImages, 
    setSelectedBreed, 
    fetchBreeds 
  } = useDog();
  
  useEffect(() => {
    if (breeds.length === 0) {
      fetchBreeds();
    }
  }, [breeds, fetchBreeds]);

  const handleBreedSelect = (event: React.ChangeEvent<HTMLSelectElement>, index: 0 | 1) => {
    const breedId = parseInt(event.target.value, 10);
    const selectedBreed = breeds.find(breed => breed.id === breedId) || null;
    setSelectedBreed(index, selectedBreed);
  };

  const calculateTrainability = (breed: any) => {
    // Algorithm to determine trainability based on breed characteristics
    const traits = breed.temperament.toLowerCase();
    if (traits.includes('intelligent') || traits.includes('trainable')) return 5;
    if (traits.includes('eager') || traits.includes('responsive')) return 4;
    if (traits.includes('stubborn') || traits.includes('independent')) return 2;
    return 3;
  };

  const calculateExerciseNeeds = (breed: any) => {
    // Algorithm to determine exercise needs based on breed group and temperament
    const traits = breed.temperament.toLowerCase();
    if (breed.breed_group === 'Working' || breed.breed_group === 'Herding') return 5;
    if (traits.includes('active') || traits.includes('energetic')) return 4;
    if (traits.includes('calm') || traits.includes('gentle')) return 2;
    return 3;
  };

  const calculateGroomingEffort = (breed: any) => {
    // Algorithm to determine grooming needs based on breed characteristics
    const traits = breed.temperament.toLowerCase();
    if (traits.includes('heavy shedding') || breed.name.includes('Shepherd')) return 5;
    if (traits.includes('minimal shedding') || breed.name.includes('Terrier')) return 2;
    return 3;
  };

  const calculateBarkingLevel = (breed: any) => {
    // Algorithm to determine barking tendency based on breed characteristics
    const traits = breed.temperament.toLowerCase();
    if (traits.includes('vocal') || traits.includes('alert')) return 5;
    if (traits.includes('quiet') || traits.includes('calm')) return 2;
    return 3;
  };

  const calculateKidFriendly = (breed: any) => {
    // Algorithm to determine kid-friendliness based on temperament
    const traits = breed.temperament.toLowerCase();
    if (traits.includes('gentle') || traits.includes('patient')) return 5;
    if (traits.includes('aggressive') || traits.includes('territorial')) return 2;
    return 3;
  };

  const renderBreedSelector = (index: 0 | 1) => (
    <div className="mb-4">
      <label htmlFor={`breed-select-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
        Select a dog breed
      </label>
      <div className="relative">
        <select
          id={`breed-select-${index}`}
          className="input appearance-none pr-10"
          value={selectedBreeds[index]?.id || ''}
          onChange={(e) => handleBreedSelect(e, index)}
        >
          <option value="">-- Select a breed --</option>
          {breeds.map(breed => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
      </div>
    </div>
  );

  const renderBreedInfo = (index: 0 | 1) => {
    const breed = selectedBreeds[index];
    const imageUrl = breedImages[index];
    
    if (!breed) return null;

    const breedMetrics = {
      size: {
        icon: <Scale size={18} className="text-primary-500" />,
        label: "Size",
        value: `Height: ${breed.height.imperial} inches\nWeight: ${breed.weight.imperial} lbs`
      },
      lifespan: {
        icon: <Clock size={18} className="text-primary-500" />,
        label: "Life Expectancy",
        value: breed.life_span
      },
      temperament: {
        icon: <Heart size={18} className="text-primary-500" />,
        label: "Temperament",
        value: breed.temperament
      },
      trainability: {
        icon: <Brain size={18} className="text-secondary-500" />,
        label: "Trainability",
        rating: calculateTrainability(breed)
      },
      exercise: {
        icon: <Dumbbell size={18} className="text-secondary-500" />,
        label: "Exercise Needs",
        rating: calculateExerciseNeeds(breed)
      },
      grooming: {
        icon: <Scissors size={18} className="text-secondary-500" />,
        label: "Grooming Effort",
        rating: calculateGroomingEffort(breed)
      },
      barking: {
        icon: <MessageSquare size={18} className="text-secondary-500" />,
        label: "Barking Level",
        rating: calculateBarkingLevel(breed)
      },
      kidFriendly: {
        icon: <Baby size={18} className="text-secondary-500" />,
        label: "Good with Kids",
        rating: calculateKidFriendly(breed)
      }
    };
    
    return (
      <div className="card h-full flex flex-col">
        <div className="h-64 bg-gray-200 relative rounded-t-lg overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={breed.name} 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PawPrint className="text-gray-400" size={32} />
            </div>
          )}
        </div>
        
        <div className="p-6 flex-grow">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold">{breed.name}</h2>
            <button 
              className="text-gray-500 hover:text-primary-500 transition-colors"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set(`breed${index + 1}`, breed.id.toString());
                navigator.clipboard.writeText(url.toString());
              }}
              title="Copy comparison link"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Info Section */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Info size={18} className="text-primary-500" />
                Basic Information
              </h3>
              <div className="space-y-4">
                {Object.entries(breedMetrics)
                  .filter(([_, metric]) => !('rating' in metric))
                  .map(([key, metric]) => (
                    <div key={key} className="flex items-start gap-2">
                      {metric.icon}
                      <div>
                        <p className="font-medium text-sm">{metric.label}</p>
                        <p className="text-gray-600 whitespace-pre-line">{metric.value}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Ratings Section */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Award size={18} className="text-secondary-500" />
                Characteristics
              </h3>
              <div className="space-y-4">
                {Object.entries(breedMetrics)
                  .filter(([_, metric]) => 'rating' in metric)
                  .map(([key, metric]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <RatingBar 
                        value={metric.rating} 
                        color={key === 'trainability' ? 'primary' : 'secondary'} 
                      />
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Dog size={18} className="text-primary-500" />
                Breed Group
              </h3>
              <p className="text-gray-600">
                {breed.breed_group || 'Not specified'} 
                {breed.bred_for && ` - ${breed.bred_for}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="pt-24 pb-16 min-h-screen bg-cream"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kompare Dog Breeds</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select two dog breeds to kompare side-by-side and discover which four-legged friend is the perfect match for your lifestyle.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-1/2">
                {renderBreedSelector(0)}
              </div>
              <div className="md:w-1/2">
                {renderBreedSelector(1)}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 mb-6 md:mb-0">
                {selectedBreeds[0] ? (
                  renderBreedInfo(0)
                ) : (
                  <div className="card h-full flex flex-col items-center justify-center p-10 text-center">
                    <PawPrint size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a dog breed on the left to see information</p>
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2">
                {selectedBreeds[1] ? (
                  renderBreedInfo(1)
                ) : (
                  <div className="card h-full flex flex-col items-center justify-center p-10 text-center">
                    <PawPrint size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a dog breed on the right to see information</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Compare;