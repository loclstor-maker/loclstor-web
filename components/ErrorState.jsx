"use client";

export default function ErrorState({ onRetry }) {
  return (
    <div className="error-state">
      <p className="error-state-title">Something went wrong</p>
      <p className="error-state-desc">We couldn’t load results. Check your connection and try again.</p>
      <button type="button" onClick={onRetry} className="error-state-btn">
        Try again
      </button>
    </div>
  );
}
