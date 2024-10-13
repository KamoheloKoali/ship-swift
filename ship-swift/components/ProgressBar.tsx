import React from 'react';

interface ProgressBarProps {
  step: number;
  steps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, steps }) => {
  const progress = (step / steps) * 100;

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ height: '10px', background: '#ccc', borderRadius: '5px' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '10px',
            background: '#4caf50',
            borderRadius: '5px',
          }}
        ></div>
      </div>
      <p>{Math.round(progress)}% Complete</p>
    </div>
  );
};

export default ProgressBar;
