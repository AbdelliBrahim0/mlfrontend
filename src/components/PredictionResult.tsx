import type { PredictionResponse } from '../types/prediction';

interface PredictionResultProps {
  data: PredictionResponse;
}

const featureLabels: Record<string, string> = {
  accident_density: 'Densite sinistres',
  disease_count: 'Nombre de maladies',
  disease_severity: 'Severite maladies',
  young_driver: 'Jeune conducteur',
  senior_driver: 'Conducteur senior',
};

export function PredictionResult({ data }: PredictionResultProps) {
  const finalScore = Number.isFinite(data.final_score) ? data.final_score : 0;
  const ruleBasedScore = Number.isFinite(data.rule_based_score)
    ? data.rule_based_score
    : 0;
  const mlScore = Number.isFinite(data.ml_score) ? data.ml_score : 0;
  const spotlight = Object.entries(data.engineered_features)
    .filter(([key]) => key in featureLabels)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <section className="result-card" aria-live="polite">
      <div className="score-block">
        <p>Score final</p>
        <h3>{finalScore.toFixed(2)} / 100</h3>
        <small>Niveau de risque: {data.risk_level}</small>
      </div>

      <div className="score-metrics">
        <article>
          <span>Score rule engine</span>
          <strong>{ruleBasedScore.toFixed(2)}</strong>
        </article>
        <article>
          <span>Score ML</span>
          <strong>{mlScore.toFixed(2)}</strong>
        </article>
      </div>

      <div className="explanation-box">
        <p>Explications</p>
        <ul>
          {data.explanations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="spotlight-grid">
        {spotlight.map(([key, value]) => (
          <article key={key} className="spotlight-item">
            <span>{featureLabels[key]}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
