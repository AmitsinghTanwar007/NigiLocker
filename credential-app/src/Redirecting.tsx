import React, { useEffect } from "react";

interface IntentFlowProps {
  setPage: (page: string) => void;
}

const Redirecting: React.FC<IntentFlowProps> = ({ setPage }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage("bengaluru-zoo");
    }, 1000);

    return () => clearTimeout(timer);
  }, [setPage]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full p-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
        </div>
      <h1 className="text-2xl font-semibold text-green-700">Redirecting to Zoo app...</h1>
    </div>
  );
};

export default Redirecting;