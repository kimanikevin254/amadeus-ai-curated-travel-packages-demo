"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Sparkles } from 'lucide-react';

interface AIRecommendationProps {
  recommendation: string;
}

export function AIRecommendation({ recommendation }: AIRecommendationProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-8 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <span>AI Travel Recommendation</span>
            <Sparkles className="w-5 h-5 text-purple-600" />
          </h2>
          <p className="text-gray-600">Personalized suggestions crafted just for you</p>
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({...props}) => <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-4" {...props} />,
            h2: ({...props}) => <h2 className="text-xl font-bold text-gray-800 mt-5 mb-3" {...props} />,
            h3: ({...props}) => <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2" {...props} />,
            p: ({...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
            ul: ({...props}) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props} />,
            ol: ({...props}) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props} />,
            li: ({...props}) => <li className="mb-1" {...props} />,
            strong: ({...props}) => <strong className="font-semibold text-gray-800" {...props} />,
            em: ({...props}) => <em className="italic text-gray-700" {...props} />,
            blockquote: ({...props}) => (
              <blockquote className="border-l-4 border-purple-300 pl-4 italic text-gray-600 my-4" {...props} />
            ),
            code: ({...props}) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props} />
            ),
          }}
        >
          {recommendation}
        </ReactMarkdown>
      </div>
    </div>
  );
}