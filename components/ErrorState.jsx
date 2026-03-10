export default function ErrorState({ onRetry }) {
  return (
    <div className="error-state">
      <p className="error-state-title">Something went wrong</p>
      <p className="error-state-desc">Could not load results. Please try again.</p>
      <button type="button" onClick={onRetry} className="error-state-btn">
        Retry
      </button>
    </div>
  );
}
