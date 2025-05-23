import React, { useRef } from 'react';

interface FileUploadTriggerProps {
  onFileSelect: (files: FileList | null) => void; // Changed to FileList
  accept?: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  id: string;
}

const FileUploadTrigger: React.FC<FileUploadTriggerProps> = ({
  onFileSelect,
  accept,
  label,
  description,
  icon,
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Removed handleTriggerClick function as it's redundant.
  // The label's htmlFor attribute will handle clicking the input.

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // This is a FileList
    onFileSelect(files);
    // Reset the input value to allow selecting the same file(s) again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label
        htmlFor={id} // This correctly associates the label with the input below.
                     // Clicking this label will now correctly trigger the file input once.
        // onClick={handleTriggerClick} // REMOVED: This was causing the double trigger or interference.
        className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-slate-50 hover:bg-slate-100"
        // It's good practice to ensure the label itself is focusable if it's acting as a control
        tabIndex={0} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }} // Optional: for keyboard accessibility
      >
        <div className="text-center">
          {icon && <div className="mx-auto h-12 w-12 text-slate-400">{icon}</div>}
          <div className="mt-4 flex text-sm leading-6 text-slate-600">
            {/* The clickable text part of the label. It doesn't need its own click handler if the parent label handles it. */}
            <span className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
              {label}
            </span>
            {/* The actual file input, hidden. */}
            <input
              id={id}
              name={id}
              type="file"
              className="sr-only" // Visually hidden, but accessible
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={accept}
              multiple // Allow multiple file selection
            />
          </div>
          {description && <p className="text-xs leading-5 text-slate-500">{description}</p>}
        </div>
      </label>
    </div>
  );
};

export default FileUploadTrigger;