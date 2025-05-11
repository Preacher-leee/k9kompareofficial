import { createContext, useState, useContext, ReactNode } from 'react';
import { DogBreed, DogFact } from '../types';
import { fetchDogBreeds, fetchBreedImage } from '../services/dogApi';

interface DogContextType {
  breeds: DogBreed[];
  loading: boolean;
  error: string | null;
  selectedBreeds: [DogBreed | null, DogBreed | null];
  breedImages: [string | null, string | null];
  facts: DogFact[];
  setSelectedBreed: (index: 0 | 1, breed: DogBreed | null) => void;
  loadBreedImage: (index: 0 | 1, breedId: number) => Promise<void>;
  fetchBreeds: () => Promise<void>;
  retryFetchBreeds: () => Promise<void>;
  isRetrying: boolean;
  retryAttempt: number;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

export function DogProvider({ children }: { children: ReactNode }) {
  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBreeds, setSelectedBreeds] = useState<[DogBreed | null, DogBreed | null]>([null, null]);
  const [breedImages, setBreedImages] = useState<[string | null, string | null]>([null, null]);
  const [facts, setFacts] = useState<DogFact[]>([]);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);

  const fetchBreeds = async () => {
    // Skip if already loading
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchDogBreeds();
      setBreeds(data);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch dog breeds. Please try again later.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced retry function with visual feedback
  const retryFetchBreeds = async () => {
    if (isRetrying) return; // Prevent multiple simultaneous retries
    
    setIsRetrying(true);
    setRetryAttempt(prev => prev + 1);
    setError(null);
    
    try {
      await fetchBreeds();
      setIsRetrying(false);
      setRetryAttempt(0); // Reset retry count on success
    } catch (err) {
      setIsRetrying(false);
      // Error will be set by fetchBreeds
    }
  };

  const setSelectedBreed = (index: 0 | 1, breed: DogBreed | null) => {
    setSelectedBreeds(prev => {
      const newBreeds = [...prev] as [DogBreed | null, DogBreed | null];
      newBreeds[index] = breed;
      return newBreeds;
    });
    
    // Clear the image when changing breeds
    setBreedImages(prev => {
      const newImages = [...prev] as [string | null, string | null];
      newImages[index] = null;
      return newImages;
    });
    
    // If a breed is selected, load its image
    if (breed) {
      loadBreedImage(index, breed.id);
    }
  };

  const loadBreedImage = async (index: 0 | 1, breedId: number) => {
    try {
      const imageUrl = await fetchBreedImage(breedId);
      setBreedImages(prev => {
        const newImages = [...prev] as [string | null, string | null];
        newImages[index] = imageUrl;
        return newImages;
      });
    } catch (err) {
      console.error('Failed to load breed image:', err);
    }
  };

  return (
    <DogContext.Provider
      value={{
        breeds,
        loading,
        error,
        selectedBreeds,
        breedImages,
        facts,
        setSelectedBreed,
        loadBreedImage,
        fetchBreeds,
        retryFetchBreeds,
        isRetrying,
        retryAttempt,
      }}
    >
      {children}
    </DogContext.Provider>
  );
}

export function useDog() {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error('useDog must be used within a DogProvider');
  }
  return context;
}