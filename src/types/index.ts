export interface DogBreed {
  id: number;
  name: string;
  temperament: string;
  life_span: string;
  weight: {
    imperial: string;
    metric: string;
  };
  height: {
    imperial: string;
    metric: string;
  };
  bred_for?: string;
  breed_group?: string;
  origin?: string;
  health_issues?: string[];
  exercise_needs: number;
  grooming_needs: number;
  family_friendly: number;
  apartment_friendly: number;
  trainability: number;
  drooling: number;
  shedding: number;
}

export interface DogFact {
  id: number;
  fact: string;
  source: string;
}

export interface UserNote {
  id: string;
  user_id: string;
  breed_id: number;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface BreedRating {
  id: string;
  user_id: string;
  breed_id: number;
  rating: number;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  breed_id: number;
  created_at: string;
}

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: {
    weeklyFacts: boolean;
    breedHighlights: boolean;
    trainingTips: boolean;
  };
}

export interface UserFeedback {
  id: string;
  user_id?: string;
  feedback: string;
  category: 'bug' | 'feature' | 'general';
  created_at: string;
}