/*
  # Add user interactions tables

  1. New Tables
    - `user_notes`: Store user notes for breeds
    - `breed_ratings`: Store user ratings for breeds
    - `user_favorites`: Store user favorite breeds
    - `user_feedback`: Store user feedback
    - `health_issues`: Store breed health issues
    - `breed_characteristics`: Store detailed breed characteristics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create health issues table
CREATE TABLE IF NOT EXISTS health_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_id integer NOT NULL,
  issue text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE health_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read health issues"
  ON health_issues
  FOR SELECT
  TO authenticated
  USING (true);

-- Create breed characteristics table
CREATE TABLE IF NOT EXISTS breed_characteristics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  breed_id integer NOT NULL,
  exercise_needs integer NOT NULL CHECK (exercise_needs BETWEEN 1 AND 5),
  grooming_needs integer NOT NULL CHECK (grooming_needs BETWEEN 1 AND 5),
  family_friendly integer NOT NULL CHECK (family_friendly BETWEEN 1 AND 5),
  apartment_friendly integer NOT NULL CHECK (apartment_friendly BETWEEN 1 AND 5),
  trainability integer NOT NULL CHECK (trainability BETWEEN 1 AND 5),
  drooling integer NOT NULL CHECK (drooling BETWEEN 1 AND 5),
  shedding integer NOT NULL CHECK (shedding BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(breed_id)
);

ALTER TABLE breed_characteristics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read breed characteristics"
  ON breed_characteristics
  FOR SELECT
  TO authenticated
  USING (true);

-- Create user notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  breed_id integer NOT NULL,
  note text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes"
  ON user_notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create breed ratings table
CREATE TABLE IF NOT EXISTS breed_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  breed_id integer NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, breed_id)
);

ALTER TABLE breed_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ratings"
  ON breed_ratings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  breed_id integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, breed_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  feedback text NOT NULL,
  category text NOT NULL CHECK (category IN ('bug', 'feature', 'general')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit feedback"
  ON user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create helpful views
CREATE VIEW breed_ratings_summary WITH (security_invoker = true) AS
SELECT 
  breed_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating)::numeric, 1) as average_rating
FROM breed_ratings
GROUP BY breed_id;

CREATE VIEW user_breed_interactions WITH (security_invoker = true) AS
SELECT
  f.breed_id,
  f.user_id,
  f.created_at as favorited_at,
  r.rating,
  r.created_at as rated_at,
  n.note,
  n.created_at as note_created_at
FROM user_favorites f
LEFT JOIN breed_ratings r ON f.breed_id = r.breed_id AND f.user_id = r.user_id
LEFT JOIN user_notes n ON f.breed_id = n.breed_id AND f.user_id = n.user_id
WHERE f.user_id = auth.uid();