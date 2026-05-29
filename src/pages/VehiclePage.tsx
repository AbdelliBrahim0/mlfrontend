import { useMemo, useState } from 'react'
import { requestVehiclePrediction } from '../api/vehicleClient'
import { VehiclePredictionResult } from '../components/VehiclePredictionResult'
import type {
  VehiclePredictionRequest,
  VehiclePredictionResponse,
} from '../types/vehicle'

export function VehiclePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VehiclePredictionResponse | null>(null)

  const [form, setForm] = useState<VehiclePredictionRequest>({
    brand: 'kia',
    model_name: 'Shuma II 1.6',
    production_year: 2003,
  })

  const normalizedBrand = useMemo(() => form.brand.trim(), [form.brand])
  const normalizedModel = useMemo(() => form.model_name.trim(), [form.model_name])

  const canSubmit =
    normalizedBrand.length > 0 &&
    normalizedModel.length > 0 &&
    form.production_year >= 1950 &&
    form.production_year <= 2035

  const runPrediction = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiResult = await requestVehiclePrediction({
        brand: normalizedBrand,
        model_name: normalizedModel,
        production_year: form.production_year,
      })

      setResult(apiResult)
    } catch (requestError) {
      setResult(null)
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Une erreur est survenue pendant la recherche vehicule.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="vehicle-page">
      <section className="vehicle-hero-panel">
        <p className="eyebrow vehicle-eyebrow">Reference vehicule</p>
        <h1>Resolution technique depuis le CSV de reference</h1>
        <p>
          Le backend recherche le vehicule via marque, modele et annee puis
          reconstruit les features attendues par le modele.
        </p>
      </section>

      <section className="vehicle-form-card">
        <h2>Recherche et scoring</h2>

        <div className="vehicle-field-grid">
          <label className="field">
            <span>Marque</span>
            <input
              type="text"
              value={form.brand}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  brand: event.target.value,
                }))
              }
              placeholder="kia"
            />
          </label>

          <label className="field">
            <span>Modele</span>
            <input
              type="text"
              value={form.model_name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  model_name: event.target.value,
                }))
              }
              placeholder="Shuma II 1.6"
            />
          </label>

          <label className="field">
            <span>Annee</span>
            <input
              type="number"
              min={1950}
              max={2035}
              value={form.production_year}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  production_year: Number(event.target.value),
                }))
              }
            />
          </label>
        </div>

        <div className="actions-row vehicle-actions-row">
          <button
            type="button"
            className="primary"
            disabled={!canSubmit || isLoading}
            onClick={runPrediction}
          >
            {isLoading ? 'Analyse en cours...' : 'Analyser le vehicule'}
          </button>
        </div>

        {error ? (
          <p className="error-banner">
            Echec de l’analyse vehicule. Verifie que CarBackend tourne sur le port
            8001 puis reessaie.
          </p>
        ) : null}

        {result ? <VehiclePredictionResult data={result} /> : null}
      </section>

      <aside className="vehicle-note-panel">
        <h2>Fonctionnement du backend</h2>
        <p>
          La reference technique est resolue en priorité sur la combinaison
          marque, modele et annee, puis les features numeriques et binaires sont
          reconstruites avant d’etre envoyees au pipeline ML.
        </p>
      </aside>
    </main>
  )
}
