import React, { useEffect, useState } from 'react';

const Snowfall: React.FC = () => {
  const [flakes, setFlakes] = useState<number[]>([]);

  useEffect(() => {
    // Create fixed number of snowflakes
    const flakeCount = 50;
    setFlakes(Array.from({ length: flakeCount }, (_, i) => i));
  }, []);

  return (
    <div className="snow-container">
      {flakes.map((i) => {
        const left = Math.random() * 100;
        const animationDuration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const opacity = 0.3 + Math.random() * 0.7;
        const size = 0.5 + Math.random() * 1.5;

        return (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${left}%`,
              fontSize: `${size}em`,
              animationDuration: `${animationDuration}s`,
              animationDelay: `-${delay}s`, // Negative delay to start mid-animation
              opacity: opacity,
            }}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
};

export default Snowfall;