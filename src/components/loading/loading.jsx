import React, { useState, useEffect } from 'react';

export default function LoadingComponent() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#004332] rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#004332] mb-2">Tayyor!</h2>
          <p className="text-gray-600">Menyu yuklandi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-[#004332]/20 rounded-full animate-spin" 
                 style={{ animationDuration: '3s' }}></div>
            
            {/* Middle rotating ring */}
            <div className="absolute inset-2 border-4 border-t-[#004332] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
                 style={{ animationDuration: '1.5s' }}></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-4 bg-gradient-to-br from-[#004332] to-[#00664a] rounded-full animate-pulse"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-[#004332] mb-4">
          Yuklanmoqda
          <span className="inline-block animate-bounce ml-1">.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.4s' }}>.</span>
        </h2>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-[#004332] to-[#00664a] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[#004332] text-sm font-semibold">{progress}%</p>
        </div>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mt-4">
          Iltimos kuting...
        </p>
      </div>
    </div>
  );
}