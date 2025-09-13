'use client';

import { ChevronDown, ChevronUp, Brain, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface ExpandableCardProps {
  title: string;
  summary: string;
  details?: string;
  children?: React.ReactNode;
  icon?: 'brain' | 'lightbulb';
  variant?: 'default' | 'highlight';
}

/**
 *
 */
export default function ExpandableCard({
  title,
  summary,
  details,
  children,
  icon = 'brain',
  variant = 'default'
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const iconElement = icon === 'brain' ? <Brain className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />;

  const bgColor = variant === 'highlight'
    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
    : 'bg-white border-gray-200';

  return (
    <div className={`rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow ${bgColor}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-md ${variant === 'highlight' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
            {iconElement}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{summary}</p>
          </div>
        </div>
        <div className={variant === 'highlight' ? 'text-indigo-600' : 'text-gray-400'}>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-700 leading-relaxed">
            {children ?? details}
          </div>
        </div>
      )}
    </div>
  );
}