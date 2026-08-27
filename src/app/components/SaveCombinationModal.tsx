import { X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface SaveCombinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, applyImmediately: boolean) => void;
  previewContent: React.ReactNode;
}

export function SaveCombinationModal({
  isOpen,
  onClose,
  onSave,
  previewContent
}: SaveCombinationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const maxDescriptionLength = 100;

  if (!isOpen) return null;

  const handleSave = (applyImmediately: boolean) => {
    if (name.trim()) {
      onSave(name.trim(), description.trim(), applyImmediately);
      setName('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full h-[90vh] overflow-hidden flex flex-col mt-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 mt-1"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl mb-1">Save selection combination</h2>
              <p className="text-sm text-gray-600">Save your current filter configuration for quick access later</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Form fields */}
          <div className="flex-1 px-6 py-6 border-r border-gray-200">
            <div className="space-y-6">
              {/* Filter name */}
              <div>
                <h3 className="text-sm mb-3">Selection name</h3>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Add filter name"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm mb-3">Selection description</h3>
                <textarea
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= maxDescriptionLength) {
                      setDescription(e.target.value);
                    }
                  }}
                  placeholder="Add description"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600 resize-none transition-colors"
                  rows={6}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">Provide additional details about this filter combination</p>
                  <p className="text-xs text-gray-600">
                    {description.length}/{maxDescriptionLength}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="w-80 bg-gray-50 p-3 overflow-y-auto">
            {previewContent}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f4f4f4] border-t border-[#c6c6c6] h-[80px] flex items-center">
          <div className="flex items-center justify-between w-full px-4 h-full">
            <div className="flex-1 h-full flex items-center">
              <button
                onClick={onClose}
                className="px-4 text-[#0f62fe] hover:text-[#0353e9] text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px]"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-px h-full">
              <button
                onClick={() => handleSave(false)}
                disabled={!name.trim()}
                className="bg-[#393939] text-white text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] hover:bg-[#4c4c4c] disabled:opacity-40 disabled:cursor-not-allowed w-[232px]"
              >
                Save
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={!name.trim()}
                className="bg-[#0f62fe] text-white text-sm font-['IBM_Plex_Sans',sans-serif] tracking-[0.16px] hover:bg-[#0353e9] disabled:opacity-40 disabled:cursor-not-allowed w-[232px]"
              >
                Save & apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}