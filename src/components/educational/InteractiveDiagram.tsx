'use client';

import { RotateCw, Mouse } from 'lucide-react';
import { useState } from 'react';

interface BrainRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  position: { top: string; left: string };
}

interface InteractiveDiagramProps {
  regions: BrainRegion[];
  onRegionClick?: (region: BrainRegion) => void;
}

/**
 *
 */
export default function InteractiveDiagram({ regions, onRegionClick }: InteractiveDiagramProps) {
  const [rotation, setRotation] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const handleRegionClick = (region: BrainRegion) => {
    setSelectedRegion(region.id);
    onRegionClick?.(region);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Mouse className="h-5 w-5 mr-2" />
          Mózg ludzki - interaktywna mapa
        </h3>
        <button
          onClick={handleRotate}
          className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
        >
          <RotateCw className="h-4 w-4 mr-1" />
          Obróć
        </button>
      </div>

      {/* Brain Diagram */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 shadow-lg">
        <div
          className="relative transition-transform duration-500 ease-in-out"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {/* Simplified brain SVG */}
          <svg viewBox="0 0 400 300" className="w-full h-auto">
            {/* Brain outline */}
            <path
              d="M200 30 C130 30 70 70 70 120 L70 180 C70 230 130 270 200 270 C270 270 330 230 330 180 L330 120 C330 70 270 30 200 30"
              fill="white"
              stroke="#6B7280"
              strokeWidth="2"
            />
            <path
              d="M200 30 C130 30 70 70 70 120"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            />

            {/* Hemisphere division */}
            <line x1="200" y1="50" x2="200" y2="250" stroke="#6B7280" strokeWidth="1" strokeDasharray="5,5" />

            {/* Regions */}
            {regions.map((region) => (
              <circle
                key={region.id}
                cx={(parseFloat(region.position.left) / 100) * 400}
                cy={(parseFloat(region.position.top) / 100) * 300}
                r="25"
                fill={selectedRegion === region.id ? region.color : `${region.color}80`}
                stroke={region.color}
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleRegionClick(region)}
              />
            ))}
          </svg>

          {/* Region labels */}
          {regions.map((region) => (
            <div
              key={`label-${region.id}`}
              className="absolute text-xs font-medium text-gray-700 text-center"
              style={{
                top: region.position.top,
                left: region.position.left,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {region.name}
            </div>
          ))}
        </div>

        {/* Selected region info */}
        {selectedRegion && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-md shadow-md border">
            {regions.find(r => r.id === selectedRegion)?.description}
          </div>
        )}
      </div>
    </div>
  );
}