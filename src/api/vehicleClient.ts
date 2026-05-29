import type {
  VehiclePredictionRequest,
  VehiclePredictionResponse,
} from '../types/vehicle'

const API_BASE_URL =
  import.meta.env.VITE_CAR_API_BASE_URL ?? 'http://127.0.0.1:8001/api/v1'

export async function requestVehiclePrediction(
  payload: VehiclePredictionRequest,
): Promise<VehiclePredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/vehicle/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Vehicle prediction request failed')
  }

  const rawResponse = (await response.json()) as Partial<VehiclePredictionResponse>

  return {
    brand: rawResponse.brand ?? payload.brand,
    model_name: rawResponse.model_name ?? payload.model_name,
    production_year: rawResponse.production_year ?? payload.production_year,
    match_strategy: rawResponse.match_strategy ?? 'unknown',
    matched_rows: rawResponse.matched_rows ?? 0,
    candidate_models: rawResponse.candidate_models ?? [],
    resolved_features: rawResponse.resolved_features ?? {},
    resolution_mode: rawResponse.resolution_mode ?? 'unknown',
    source_name: rawResponse.source_name ?? 'unknown',
    source_url: rawResponse.source_url ?? null,
    confidence: rawResponse.confidence ?? 0,
    warnings: rawResponse.warnings ?? [],
    resolution_trace: rawResponse.resolution_trace ?? [],
    vehicle_score: rawResponse.vehicle_score ?? 0,
    risk_level: rawResponse.risk_level ?? 'MEDIUM',
  }
}
