import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1 font-cairo">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg font-cairo text-right ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 font-cairo">{error}</p>}
    </div>
  );
}
