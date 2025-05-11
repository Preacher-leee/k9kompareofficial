import axios from 'axios';
import { DogBreed, DogFact } from '../types';

// API URLs
const DOG_API_URL = 'https://api.thedogapi.com/v1';
const DOG_CEO_API_URL = 'https://dog.ceo/api';
const HTTP_DOG_API_URL = 'https://http.dog';

// API Key
const DOG_API_KEY = 'live_WqxFmIlbKwcg8VQ2V0B7N65N9vZL3mWnB0GWAWzSNGogQUJBuiLqKBxSTFYjkOQW';

// Mock dog facts data
const mockDogFacts: DogFact[] = [
  {
    id: 'fact-1',
    fact: 'Dogs have a sense of time and can differentiate between 5 minutes and 2 hours.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-2',
    fact: 'A dog\'s nose print is unique, much like a human\'s fingerprint.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-3',
    fact: 'Dogs can understand over 150 words and can count up to five.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-4',
    fact: 'Puppies are born blind, deaf, and toothless.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-5',
    fact: 'A dog\'s whiskers help them navigate in the dark.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-6',
    fact: 'Dogs dream just like humans and experience similar sleep stages.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-7',
    fact: 'The Basenji is the only breed of dog that doesn\'t bark.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-8',
    fact: 'Dogs have three eyelids, including one specifically for lubrication.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-9',
    fact: 'A dog\'s sense of smell is about 40 times greater than humans.',
    source: 'Dog Facts Database'
  },
  {
    id: 'fact-10',
    fact: 'Dogs can hear sounds at four times the distance humans can.',
    source: 'Dog Facts Database'
  }
];

// Create an axios instance with default configuration
const dogApiClient = axios.create({
  baseURL: DOG_API_URL,
  headers: {
    'x-api-key': DOG_API_KEY,
  },
  timeout: 15000, // Increased from 10000 to 15000
});

// Helper function to implement delay with exponential backoff
const delay = (retryCount: number) => {
  const baseDelay = 3000; // Increased from 2000 to 3000
  return new Promise(resolve => 
    setTimeout(resolve, Math.min(baseDelay * Math.pow(2, retryCount), 24000)) // Increased from 16000 to 24000
  );
};

// Fetch dog facts (now using mock data)
export const fetchDogFacts = async (count: number = 5): Promise<DogFact[]> => {
  // Shuffle the mock facts and return the requested number
  const shuffledFacts = [...mockDogFacts]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return shuffledFacts;
};

// Rest of the file remains unchanged
export const fetchDogBreeds = async (maxRetries = 5): Promise<DogBreed[]> => { // Increased from 3 to 5
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const response = await dogApiClient.get('/breeds');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          if (retryCount < maxRetries) {
            console.log(`Rate limited, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          throw new Error('API rate limit exceeded. Please try again later.');
        }

        if (error.code === 'ECONNABORTED') {
          if (retryCount < maxRetries) {
            console.log(`Request timeout, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          console.error('Request timeout when fetching dog breeds');
          throw new Error('The request timed out. Please check your internet connection and try again later.');
        }
        
        if (error.code === 'ERR_NETWORK') {
          if (retryCount < maxRetries) {
            console.log(`Network error, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          console.error('Network error when fetching dog breeds');
          throw new Error('Network connection error. Please check your internet connection and try again.');
        }
        
        if (error.response) {
          console.error(`Error ${error.response.status} fetching dog breeds:`, error.response.data);
          throw new Error(`Server error (${error.response.status}). Please try again later.`);
        } else if (error.request) {
          if (retryCount < maxRetries) {
            console.log(`No response received, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          console.error('No response received when fetching dog breeds');
          throw new Error('No response from the server. Please try again later.');
        }
      }
      
      console.error('Error fetching dog breeds:', error);
      throw new Error('Failed to fetch dog breeds. Please try again later.');
    }
  }

  throw new Error('Failed to fetch dog breeds after multiple retries. Please try again later.');
};

export const fetchDogBreedById = async (breedId: number): Promise<DogBreed> => {
  try {
    const response = await dogApiClient.get(`/breeds/${breedId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dog breed with ID ${breedId}:`, error);
    throw error;
  }
};

export const fetchBreedImage = async (breedId: number): Promise<string> => {
  try {
    const response = await dogApiClient.get('/images/search', {
      params: {
        breed_id: breedId,
        limit: 1,
      },
    });
    
    if (response.data && response.data.length > 0) {
      return response.data[0].url;
    }
    throw new Error('No image found for this breed');
  } catch (error) {
    console.error(`Error fetching image for breed ID ${breedId}:`, error);
    throw error;
  }
};

export const fetchRandomDogImages = async (count: number = 3, maxRetries = 5): Promise<string[]> => { // Increased from 3 to 5
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      const response = await axios.get(`${DOG_CEO_API_URL}/breeds/image/random/${count}`);
      if (response.data && response.data.status === 'success') {
        return response.data.message;
      }
      throw new Error('Failed to fetch random dog images');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          if (retryCount < maxRetries) {
            console.log(`Network error, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          console.error('Network error when fetching random dog images');
          throw new Error('Network connection error. Please check your internet connection and try again.');
        }

        if (error.code === 'ECONNABORTED') {
          if (retryCount < maxRetries) {
            console.log(`Request timeout, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          console.error('Request timeout when fetching random dog images');
          throw new Error('The request timed out. Please check your internet connection and try again.');
        }

        if (error.response) {
          console.error(`Error ${error.response.status} fetching random dog images:`, error.response.data);
          throw new Error(`Server error (${error.response.status}). Please try again later.`);
        } else if (error.request) {
          if (retryCount < maxRetries) {
            console.log(`No response received, retrying in ${3 * Math.pow(2, retryCount)} seconds...`);
            await delay(retryCount);
            retryCount++;
            continue;
          }
          console.error('No response received when fetching random dog images');
          throw new Error('No response from the server. Please try again later.');
        }
      }
      
      console.error('Error fetching random dog images:', error);
      throw new Error('Failed to fetch random dog images. Please try again later.');
    }
  }

  throw new Error('Failed to fetch random dog images after multiple retries. Please try again later.');
};

export const getHttpDogImageUrl = (statusCode: number): string => {
  return `${HTTP_DOG_API_URL}/${statusCode}.jpg`;
};

export const subscribeToNewsletter = async (email: string, firstName?: string, lastName?: string, preferences = {
  weeklyFacts: true,
  breedHighlights: true,
  trainingTips: false,
}): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        resolve({
          success: false,
          message: 'Please enter a valid email address',
        });
        return;
      }
      
      resolve({
        success: true,
        message: 'Thank you for subscribing to our newsletter!',
      });
    }, 1000);
  });
};