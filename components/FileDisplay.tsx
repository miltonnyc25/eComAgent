import React from 'react';
import DocumentTextIcon from './icons/DocumentTextIcon';
import PhotographIcon from './icons/PhotographIcon';

interface FileDisplayProps {
  file: File | null; // Will still receive one file at a time
  previewUrl?: string | null; // For image previews
  type: 'image' | 'generic';
  onClear?: () => void; // onClear will be specific to this file instance
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file, previewUrl, type, onClear }) => {
  if (!file) {
    // This case might be less used if App.tsx filters out nulls before rendering
    return (
      <div className="mt-4 p-4 text-sm text-slate-500 border border-slate-200 rounded-md bg-slate-50 min-h-[80px] flex items-center justify-center">
        No file data provided.
      </div>
    );
  }

  const fileSizeKB = (file.size / 1024).toFixed(2);

  return (
    <div className="p-4 border border-slate-200 rounded-md bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {type === 'image' && previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="h-16 w-16 rounded-md object-cover border border-slate-200 flex-shrink-0"
            />
          ) : type === 'image' ? (
             <PhotographIcon className="h-10 w-10 text-indigo-500 flex-shrink-0" />
          ) : (
            <DocumentTextIcon className="h-10 w-10 text-indigo-500 flex-shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>{file.name}</p>
            <p className="text-xs text-slate-500">{fileSizeKB} KB</p>
          </div>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="ml-4 text-sm font-semibold text-red-600 hover:text-red-500 transition-colors flex-shrink-0"
            aria-label={`Clear ${file.name}`}
          >
            Clear
          </button>
        )}
      </div>
      {type === 'image' && previewUrl && (
        <div className="mt-4">
            <img src={previewUrl} alt={`Preview of ${file.name}`} className="rounded-lg max-w-full h-auto max-h-64 object-contain mx-auto border border-slate-200" />
        </div>
      )}
    </div>
  );
};

export default FileDisplay;