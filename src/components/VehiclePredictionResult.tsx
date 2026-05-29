import type { VehiclePredictionResponse } from '../types/vehicle'

interface VehiclePredictionResultProps {
  data: VehiclePredictionResponse
}

const featureLabels: Record<string, string> = {
  production_year: 'Annee de production',
  weight_kg: 'Poids (kg)',
  width_mm: 'Largeur (mm)',
  acceleration_sec: 'Acceleration 0-100 (s)',
  power_ps_per_tonne: 'Puissance / tonne',
  has_abs: 'ABS',
  front_disc: 'Freins disques avant',
  rear_disc: 'Freins disques arriere',
  rear_drum: 'Freins tambours arriere',
  ventilated_brakes: 'Freins ventiles',
  drive_type: 'Transmission',
}

const statusLabels: Record<string, string> = {
  done: 'Termine',
  failed: 'Echec',
  skipped: 'Ignore',
}

export function VehiclePredictionResult({ data }: VehiclePredictionResultProps) {
  const featureEntries = Object.entries(data.resolved_features)
  const resolutionTrace = data.resolution_trace ?? []
  const candidateModels = data.candidate_models ?? []
  const warnings = data.warnings ?? []

  return (
    <section className="vehicle-result-card" aria-live="polite">
      <div className="resolution-trace-box">
        <p>Etapes de resolution</p>
        <div className="resolution-trace-list">
          {resolutionTrace.length > 0 ? (
            resolutionTrace.map((step) => (
              <article
                key={`${step.step}-${step.status}`}
                className={`trace-step trace-${step.status}`}
              >
                <div className="trace-step-header">
                  <strong>{step.step.replace(/_/g, ' ')}</strong>
                  <span>{statusLabels[step.status] ?? step.status}</span>
                </div>
                <small>{step.detail}</small>
              </article>
            ))
          ) : (
            <article className="trace-step trace-skipped">
              <div className="trace-step-header">
                <strong>Resolution</strong>
                <span>Non detaillee</span>
              </div>
              <small>Aucune trace n’a ete retournee par le backend pour cette analyse.</small>
            </article>
          )}
        </div>
      </div>

      <div className="vehicle-score-block">
        <p>Score vehicule</p>
        <h3>{Number(data.vehicle_score).toFixed(2)} / 100</h3>
      </div>

      <div className="vehicle-meta-grid">
        <article>
          <span>Mode de correspondance</span>
          <strong>{data.match_strategy}</strong>
        </article>
        <article>
          <span>Lignes candidates</span>
          <strong>{data.matched_rows}</strong>
        </article>
      </div>

      <div className="vehicle-explanation-box">
        <p>Modeles candidats</p>
        <ul>
          {candidateModels.length > 0 ? (
            candidateModels.map((item) => <li key={item}>{item}</li>)
          ) : (
            <li>Aucun modele supplementaire detecte</li>
          )}
        </ul>
      </div>

      <div className="vehicle-explanation-box">
        <p>Confiance et source</p>
        <ul>
          <li>Mode: {data.resolution_mode}</li>
          <li>Source: {data.source_name}</li>
          <li>Confiance: {Math.round(data.confidence * 100)}%</li>
          {warnings.length > 0 ? (
            <li>Avertissements: {warnings.join(' | ')}</li>
          ) : (
            <li>Aucun avertissement de validation</li>
          )}
        </ul>
      </div>

      <div className="vehicle-feature-grid">
        {featureEntries.map(([key, value]) => (
          <article key={key} className="vehicle-feature-item">
            <span>{featureLabels[key] ?? key}</span>
            <strong>{value ?? 'Estime'}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
