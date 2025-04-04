import '../styles/ProgressBar.css';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const ProgressBar = ({ currentStep, totalSteps, stepLabels }: ProgressBarProps) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <div className="progress-steps">
        {stepLabels.map((label, index) => (
          <div 
            key={index}
            className={`progress-step ${index < currentStep ? 'completed' : ''} ${
              index === currentStep ? 'current' : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 