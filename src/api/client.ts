import type { PredictionRequest, PredictionResponse } from '../types/prediction';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1';

export async function requestPrediction(
  payload: PredictionRequest,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/prediction/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Prediction request failed');
  }

  const rawResponse = (await response.json()) as Partial<PredictionResponse> & {
    model_score?: number;
  };

  const ruleBasedScore = rawResponse.rule_based_score ?? rawResponse.business_score ?? 0;
  const mlScore = rawResponse.ml_score ?? rawResponse.model_score ?? 0;
  const finalScore = rawResponse.final_score ?? mlScore;

  return {
    rule_based_score: ruleBasedScore,
    ml_score: mlScore,
    final_score: finalScore,
    risk_level: rawResponse.risk_level ?? 'MEDIUM',
    explanations: rawResponse.explanations ?? [],
    engineered_features: rawResponse.engineered_features ?? {},
    business_score: rawResponse.business_score ?? ruleBasedScore,
    comparison_status: rawResponse.comparison_status ?? 'completed',
  };
}
