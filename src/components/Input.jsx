import React, { useId } from 'react';

const Input = React.forwardRef( function Input ({
    label, 
    type = 'text', 
    placeholder, 
    className = '', 
    error, 
    ...props 
}, ref ) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1 text-sm font-medium text-gray-300">
          {label}{' '}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        ref={ref}
        className={`w-full px-4 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ` + className}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
});

export default Input;