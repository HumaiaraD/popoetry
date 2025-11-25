"use client";

export default function StartupCardSkeleton() {
  return (
    <li className="border-6 border-gray-300 rounded-2xl p-5 animate-pulse">
      <div className="h-4 bg-gray-300 w-1/3 mb-3 rounded" />
      <div className="h-4 bg-gray-300 w-1/4 mb-3 rounded" />
      <div className="h-6 bg-gray-300 w-2/3 mb-4 rounded" />
      <div className="h-4 bg-gray-300 w-full mb-2 rounded" />
      <div className="h-4 bg-gray-300 w-5/6 rounded" />
    </li>
  );
}
