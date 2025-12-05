import React from "react";
import { CheckCircle, Circle } from "lucide-react";

export default function Timeline({ steps, currentStep }) {
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="timeline d-flex gap-3">
      {steps.map((step, idx) => (
        <div key={step.key} className={`timeline-item d-flex align-items-center ${idx <= currentIndex ? "completed" : ""}`}>
          <div className="timeline-icon me-2">
            {idx <= currentIndex ? <CheckCircle size={24} /> : <Circle size={24} />}
          </div>
          <div className="timeline-content">
            <div className="timeline-label fw-semibold">{step.label}</div>
            {step.timestamp && <div className="timeline-time">{step.timestamp}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
