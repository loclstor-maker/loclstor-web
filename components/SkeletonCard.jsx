"use client";

export default function SkeletonCard() {
  return (
    <li className="skeleton-card">
      <div className="skeleton-card-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-distance" />
      </div>
      <div className="skeleton skeleton-area" />
      <div className="skeleton skeleton-phone" />
      <div className="skeleton-tags">
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
        <div className="skeleton skeleton-tag" />
      </div>
    </li>
  );
}
