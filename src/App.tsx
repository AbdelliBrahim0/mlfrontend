import { useMemo, useState } from 'react'
import { requestPrediction } from './api/client'
import { HealthChecklist } from './components/HealthChecklist'
import { PredictionResult } from './components/PredictionResult'
import { StepProgress } from './components/StepProgress'
import { SEX_OPTIONS } from './constants/options'
import type {
  DiseaseCategory,
  PredictionRequest,
  PredictionResponse,
} from './types/prediction'
import { VehiclePage } from './pages/VehiclePage'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState<'person' | 'vehicle'>('person')
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)

  const [form, setForm] = useState<PredictionRequest>({
    sex: 'male',
    age: 30,
    license_years: 8,
    claims: 0,
    diseases: [],
  })

  const maxLicenseYears = useMemo(() => Math.max(0, form.age - 18), [form.age])

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return form.age >= 18 && form.age <= 95
    }
    if (step === 2) {
      return form.license_years <= maxLicenseYears && form.claims >= 0
    }
    return true
  }, [form.age, form.claims, form.license_years, maxLicenseYears, step])

  const toggleDisease = (disease: DiseaseCategory) => {
    setForm((previous) => {
      const alreadySelected = previous.diseases.includes(disease)
      return {
        ...previous,
        diseases: alreadySelected
          ? previous.diseases.filter((item) => item !== disease)
          : [...previous.diseases, disease],
      }
    })
  }

  const runPrediction = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiResult = await requestPrediction(form)
      setResult(apiResult)
    } catch (requestError) {
      setResult(null)
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Une erreur est survenue pendant la prediction.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="workspace-shell">
      <header className="mode-switcher" aria-label="Selection de page">
        <div>
          <p className="eyebrow">Nawress Astree</p>
          <h1>Plateforme de scoring vehicule et conducteur</h1>
        </div>

        <div className="mode-toggle" role="tablist" aria-label="Pages disponibles">
          <button
            type="button"
            className={activeView === 'person' ? 'active' : ''}
            aria-pressed={activeView === 'person'}
            onClick={() => setActiveView('person')}
          >
            Profil conducteur
          </button>
          <button
            type="button"
            className={activeView === 'vehicle' ? 'active' : ''}
            aria-pressed={activeView === 'vehicle'}
            onClick={() => setActiveView('vehicle')}
          >
            Analyse vehicule
          </button>
        </div>
      </header>

      {activeView === 'vehicle' ? (
        <VehiclePage />
      ) : (
        <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Profil Conducteur</p>
        <h1>Simulation du score de risque</h1>
        <p>
          Cette interface alimente le modele ML et expose une architecture prete
          pour comparer bientot score modele et score logique metier.
        </p>
      </section>

      <section className="form-card">
        <StepProgress currentStep={step} />

        {step === 1 ? (
          <div className="step-content">
            <h2>Informations personnelles</h2>
            <label className="field">
              <span>Sexe</span>
              <select
                value={form.sex}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    sex: event.target.value as PredictionRequest['sex'],
                  }))
                }
              >
                {SEX_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Age</span>
              <input
                type="number"
                min={18}
                max={95}
                value={form.age}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    age: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="step-content">
            <h2>Historique de conduite</h2>
            <label className="field">
              <span>Annees de permis</span>
              <input
                type="number"
                min={0}
                max={maxLicenseYears}
                value={form.license_years}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    license_years: Number(event.target.value),
                  }))
                }
              />
              <small>Maximum autorise selon age: {maxLicenseYears}</small>
            </label>

            <label className="field">
              <span>Nombre de sinistres</span>
              <input
                type="number"
                min={0}
                max={200}
                value={form.claims}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    claims: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="step-content health-step">
            <h2>Avez-vous l'une des maladies suivantes ?</h2>
            <HealthChecklist selected={form.diseases} onToggle={toggleDisease} />
          </div>
        ) : null}

        <div className="actions-row">
          <button
            type="button"
            className="secondary"
            disabled={step === 1 || isLoading}
            onClick={() => setStep((previous) => Math.max(1, previous - 1))}
          >
            Precedent
          </button>

          {step < 3 ? (
            <button
              type="button"
              className="primary"
              disabled={!canGoNext || isLoading}
              onClick={() => setStep((previous) => Math.min(3, previous + 1))}
            >
              Continuer
            </button>
          ) : (
            <button
              type="button"
              className="primary"
              disabled={isLoading}
              onClick={runPrediction}
            >
              {isLoading ? 'Prediction en cours...' : 'Enregistrer et predire'}
            </button>
          )}
        </div>

        {error ? (
          <p className="error-banner">
            Echec prediction. Verifie que le backend FastAPI est lance puis
            reessaie.
          </p>
        ) : null}

        {result ? <PredictionResult data={result} /> : null}
      </section>

          <aside className="note-panel">
            <h2>Prochaine etape architecture</h2>
            <p>
              Le backend est deja preconfigure pour ajouter la logique metier
              parallele et afficher ensuite la comparaison avec le score modele.
            </p>
          </aside>
        </main>
      )}
    </div>
  )
}

export default App
