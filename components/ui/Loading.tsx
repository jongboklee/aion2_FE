"use client";

import { ReactNode } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizes[size]} text-blue-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "로딩 중..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = "오류 발생", message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">
            {title}
          </h3>
          <p className="text-red-700 dark:text-red-400">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 text-sm font-medium text-red-800 dark:text-red-300 hover:underline"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
          {message}
        </p>
      )}
    </div>
  );
}

