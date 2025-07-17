import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const StatusToggle = ({ status, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        group inline-flex items-center justify-center gap-2
        w-[120px] px-3 py-1.5 rounded-md
        transition-all duration-200 ease-in-out
        ${status === 'active' 
          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
          : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
        }
      `}
    >
      {/* Icon */}
      {status === 'active' ? (
        <CheckCircle2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <XCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      )}

      {/* Text */}
      <span className="text-xs font-medium">
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>

      {/* Dot Indicator */}
      <span className={`
        h-1.5 w-1.5 rounded-full
        transition-colors duration-200
        ${status === 'active' 
          ? 'bg-emerald-500' 
          : 'bg-rose-500'
        }
      `} />
    </button>
  );
};

export default StatusToggle; 