import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  isLate: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile, isLate }) => {
  const [dragging, setDragging] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      onFileSelect(droppedFile);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  return (
    <div
      className={`relative group border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out
        ${dragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
        }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleFileDrop}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <Upload className="w-8 h-8 text-blue-500 mb-4" />
        <span className="text-sm font-medium text-gray-700">
          {selectedFile
            ? selectedFile.name
            : "Drag & drop your PDF here or click to browse"}
        </span>
        <span className="text-xs text-gray-500 mt-2">
          Only PDF files are accepted
        </span>
      </label>
    </div>
  );
};

export default FileUploader;