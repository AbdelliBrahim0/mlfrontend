interface StepProgressProps {
  currentStep: number;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [1, 2, 3];

  return (
    <div className="stepper" aria-label="Form steps">
      {steps.map((step, index) => {
        const state =
          step < currentStep ? 'done' : step === currentStep ? 'active' : 'todo';

        return (
          <div key={step} className="stepper-item">
            <span className={`step-node step-${state}`}>{step}</span>
            {index < steps.length - 1 ? <span className="step-line" /> : null}
          </div>
        );
      })}
    </div>
  );
}
