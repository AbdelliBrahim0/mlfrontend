import { DISEASE_OPTIONS } from '../constants/options';
import type { DiseaseCategory } from '../types/prediction';

interface HealthChecklistProps {
  selected: DiseaseCategory[];
  onToggle: (disease: DiseaseCategory) => void;
}

export function HealthChecklist({ selected, onToggle }: HealthChecklistProps) {
  return (
    <div className="health-list" role="group" aria-label="Maladies">
      {DISEASE_OPTIONS.map((option) => {
        const checked = selected.includes(option.value);

        return (
          <label key={option.value} className="health-item">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option.value)}
            />
            <span className="health-label">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
