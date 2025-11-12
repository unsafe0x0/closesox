import React from "react";

const Spinner = ({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    style={{ width: size, height: size }}
    aria-label="Loading"
    role="status"
  >
    <span className="relative block w-full h-full" style={{ perspective: 120 }}>
      <span className="absolute inset-0 w-full h-full animate-spin-cube">
        <span
          className="block w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span
            className="absolute w-full h-full bg-card border border-primary"
            style={{ transform: "rotateY(0deg) translateZ(20px)" }}
          />
          <span
            className="absolute w-full h-full bg-card border border-primary"
            style={{ transform: "rotateY(180deg) translateZ(20px)" }}
          />
          <span
            className="absolute w-full h-full bg-card border border-primary"
            style={{ transform: "rotateX(90deg) translateZ(20px)" }}
          />
          <span
            className="absolute w-full h-full bg-card border border-primary"
            style={{ transform: "rotateX(-90deg) translateZ(20px)" }}
          />
          <span
            className="absolute w-full h-full bg-card border border-primary"
            style={{ transform: "rotateY(90deg) translateZ(20px)" }}
          />
          <span
            className="absolute w-full h-full bg-card border border-primary"
            style={{ transform: "rotateY(-90deg) translateZ(20px)" }}
          />
        </span>
      </span>
    </span>
    <style jsx>{`
      @keyframes spin-cube {
        0% {
          transform: rotateX(0deg) rotateY(0deg);
        }
        100% {
          transform: rotateX(360deg) rotateY(360deg);
        }
      }
      .animate-spin-cube {
        animation: spin-cube 1.2s linear infinite;
        transform-style: preserve-3d;
      }
    `}</style>
  </span>
);

export default Spinner;
