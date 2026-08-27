import { RefreshCw } from 'lucide-react';

export interface SavedCombination {
  id: string;
  name: string;
  description: string;
  savedOn: string;
  filterData?: any; // Store all filter selections
}

interface SavedCombinationsViewProps {
  selectedCombinationId: string | null;
  onSelectCombination: (id: string) => void;
  savedCombinations: SavedCombination[];
  highlightedCombinationId?: string | null;
}

export function SavedCombinationsView({
  selectedCombinationId,
  onSelectCombination,
  savedCombinations,
  highlightedCombinationId
}: SavedCombinationsViewProps) {
  return (
    <div className="py-5">
      <style>{`
        @keyframes highlightFade {
          0% { box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.5); }
          50% { box-shadow: 0 0 0 3px rgba(15, 98, 254, 0.3); }
          100% { box-shadow: 0 0 0 0px rgba(15, 98, 254, 0); }
        }
        .highlight-saved {
          animation: highlightFade 3s ease-out forwards;
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedCombinations.map((combination) => (
          <div
            key={combination.id}
            className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${
              selectedCombinationId === combination.id
                ? 'border-blue-500 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            } ${highlightedCombinationId === combination.id ? 'highlight-saved' : ''}`}
            onClick={() => onSelectCombination(combination.id)}
          >
            {/* Card Header */}
            <div className="px-4 py-3 bg-white">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedCombinationId === combination.id
                      ? 'border-black flex items-center justify-center'
                      : 'border-gray-400'
                  }`}>
                    {selectedCombinationId === combination.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium">{combination.name}</h3>
                </div>
              </div>
            </div>

            {/* Description section */}
            <div className="bg-white">
              <div className="px-4 pt-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {combination.description}
                </p>
              </div>
              <div className="px-4 py-3 border-t border-gray-200 mt-3">
                <p className="text-xs text-gray-400">
                  Saved on: {combination.savedOn}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}