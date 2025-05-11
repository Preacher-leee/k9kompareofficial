/*
  # Add Owner Reviews and Cost Data

  1. New Tables
    - `breed_reviews`
      - User reviews and ratings for specific breeds
      - Includes ratings for temperament, trainability, shedding, health
      - Allows text reviews and overall star rating
    
    - `breed_costs`
      - Standard cost estimates for each breed
      - Monthly/yearly breakdowns
      - Categories like food, grooming, vet care
    
    - `local_resources`
      - Stores verified breeders and rescue organizations
      - Location data for proximity search
      - Partnership/affiliate tracking

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
*/

-- Create breed reviews table
CREATE TABLE IF NOT EXISTS breed_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  breed_id integer NOT NULL,
  temperament_rating integer CHECK (temperament_rating BETWEEN 1 AND 5),
  trainability_rating integer CHECK (trainability_rating BETWEEN 1 AND 5),
  shedding_rating integer CHECK (shedding_rating BETWEEN 1 AND 5),
  health_rating integer CHECK (health_rating BETWEEN 1 AND 5),
  overall_rating integer CHECK (overall_rating BETWEEN 1 AND 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, breed_id)
);

ALTER TABLE breed_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all reviews"
  ON breed_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own reviews"
  ON breed_reviews
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create breed costs table
CREATE TABLE IF NOT EXISTS breed_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_id integer NOT NULL UNIQUE,
  food_cost_monthly decimal NOT NULL,
  grooming_cost_monthly decimal NOT NULL,
  vet_cost_yearly decimal NOT NULL,
  insurance_cost_monthly decimal,
  training_cost_initial decimal,
  supplies_cost_initial decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE breed_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read breed costs"
  ON breed_costs
  FOR SELECT
  TO authenticated
  USING (true);

-- Create local resources table
CREATE TABLE IF NOT EXISTS local_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('breeder', 'rescue')),
  breed_id integer,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  latitude decimal,
  longitude decimal,
  website text,
  phone text,
  email text,
  is_verified boolean DEFAULT false,
  partnership_type text CHECK (partnership_type IN ('affiliate', 'donation', 'none')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE local_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read verified resources"
  ON local_resources
  FOR SELECT
  TO authenticated
  USING (is_verified = true);

-- Create view for breed review summaries
CREATE VIEW breed_review_summaries WITH (security_invoker = true) AS
SELECT 
  breed_id,
  COUNT(*) as total_reviews,
  ROUND(AVG(overall_rating)::numeric, 1) as average_rating,
  ROUND(AVG(temperament_rating)::numeric, 1) as avg_temperament,
  ROUND(AVG(trainability_rating)::numeric, 1) as avg_trainability,
  ROUND(AVG(shedding_rating)::numeric, 1) as avg_shedding,
  ROUND(AVG(health_rating)::numeric, 1) as avg_health
FROM breed_reviews
GROUP BY breed_id;