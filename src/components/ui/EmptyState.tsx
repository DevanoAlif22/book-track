import React from "react";
import { RefreshCw } from "lucide-react";

interface EmptyStateProps {
  onRetry: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRetry }) => (
  <div className="text-center py-20">
    <div className="bg-theme-card rounded-2xl p-12 shadow-lg border border-theme max-w-md mx-auto transition-colors duration-300">
      {/* ... empty state content */}
      <button
        onClick={onRetry}
        className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Muat Ulang</span>
      </button>
    </div>
  </div>
);

export default EmptyState;
