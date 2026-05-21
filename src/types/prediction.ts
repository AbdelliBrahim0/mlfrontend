export type Sex = 'male' | 'female';

export type DiseaseCategory =
  | 'neurological'
  | 'cardiovascular'
  | 'metabolic'
  | 'respiratory'
  | 'psychiatric'
  | 'sensory'
  | 'musculoskeletal';

export interface PredictionRequest {
  sex: Sex;
  age: number;
  license_years: number;
  claims: number;
  diseases: DiseaseCategory[];
}

export interface PredictionResponse {
  rule_based_score: number;
  ml_score: number;
  final_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanations: string[];
  engineered_features: Record<string, string | number>;
  business_score: number | null;
  comparison_status: string;
}
