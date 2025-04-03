import React, { useEffect } from "react";
import digilocker from "./digilocker1.png";

interface IntentFlowProps {
  setPage: (page: string) => void;
}

const IntentFlow: React.FC<IntentFlowProps> = ({ setPage }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage("verifiable-credential");
    }, 1000);

    return () => clearTimeout(timer);
  }, [setPage]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-purple-100">
      <img
        src={digilocker}
        alt="DigiLocker Logo"
        className="w-24 h-24 mb-4 shadow-md shadow-black rounded-md text-2xl"
      />
      <h1 className="text-2xl font-semibold text-purple-700">Opening DigiLocker...</h1>
    </div>
  );
};

export default IntentFlow;

