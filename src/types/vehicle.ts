export interface VehiclePredictionRequest {
  brand: string
  model_name: string
  production_year: number
}

export interface VehiclePredictionResponse {
  brand: string
  model_name: string
  production_year: number
  match_strategy: string
  matched_rows: number
  candidate_models: string[]
  resolved_features: Record<string, string | number | null>
  resolution_mode: string
  source_name: string
  source_url: string | null
  confidence: number
  warnings: string[]
  resolution_trace: Array<{
    step: string
    status: string
    detail: string
  }>
  vehicle_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}
