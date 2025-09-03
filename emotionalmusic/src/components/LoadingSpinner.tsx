import React from "react";
import { motion } from "framer-motion";

type LoadingSpinnerProps = {
  emotion: string;
}

export default function LoadingSpinner({ emotion }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-sans bg-gray-50">
      <div className="modern-card p-16 max-w-lg w-full text-center relative">
        
        <motion.div
          className="mb-12"
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl">
            🎵
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          음악 추천 중
        </h2>
        <p className="text-gray-700 mb-8 leading-relaxed">
          AI가 당신의 감정에 어울리는 음악을 찾고 있습니다...
        </p>
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-3">
            <motion.div
              className="w-3 h-3 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-3 h-3 bg-blue-600 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700">AI 추천 중...</div>
          <p className="text-sm text-gray-600 mt-2">
            감정: <span className="font-medium text-blue-600">"{emotion}"</span>
          </p>
        </div>
      </div>
    </div>
  );
} 