import React, { useState, useEffect } from 'react';
import ProceedPage1 from './ProceedPage1'; // Make sure to import the correct path

interface Credential {
  name: string;
}

interface DerivedCredentialProps {
  setPage1: (page: string) => void;
  setSelectedCred: (cred: string) => void;
  selectedCred: string;
  setCredId: (id: string) => void;
}

const DerivedCredential1: React.FC<DerivedCredentialProps> = ({ 
  setPage1, 
  setSelectedCred, 
  selectedCred, 
  setCredId
}) => {
  const [derivedCreds, setDerivedCreds] = useState<string[]>([]);
  const [foundCreds, setFoundCreds] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Get the array of credential names from localStorage
    localStorage.setItem('derivedCred', JSON.stringify(['age less than 15', 'age Greater than 60', 'place']));
    const derivedCredString = localStorage.getItem('derivedCred');
    
    if (derivedCredString) {
      try {
        const parsedCreds = JSON.parse(derivedCredString);
        if (Array.isArray(parsedCreds)) {
          setDerivedCreds(parsedCreds);
          
          // Check which credentials exist in localStorage
          const found = parsedCreds.filter(name => {
            return localStorage.getItem(name) !== null;
          });
          
          setFoundCreds(found);
          
          // Set default selected credential if any found
          if (found.length > 0) {
            setSelectedCred(found[0]);
          }
        }
      } catch (error) {
        console.error('Error parsing derivedCred from localStorage:', error);
      }
    }
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCred(e.target.value);
  };

  const handleProceed = () => {
    if (selectedCred) {
      setShowPopup(true);
    } else {
      alert('Please select a credential to proceed');
    }
  };

  return (
    <div className="max-w-md mx-auto h-full p-6 bg-indigo-50 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <button 
          className="text-gray-700"
          onClick={() => setPage1("verifiable-credential")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Verifiable Credential</h2>
      
      <div className="mb-6">
        <label htmlFor="credential-select" className="block text-sm font-medium text-gray-100 mb-2">
          Select Derived Credential Type:
        </label>
        <select 
          id="credential-select" 
          value={selectedCred} 
          onChange={handleSelectChange}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
        >
          <option value="" className="bg-white text-black">-- Select Derived Credential Type --</option>
          {derivedCreds.map((cred) => (
            <option key={cred} value={cred} className="bg-white text-black">
              {cred}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        className={`w-full py-3 px-4 rounded-lg mb-3 font-semibold text-white ${
          selectedCred 
            ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
            : 'bg-indigo-300 cursor-not-allowed'
        }`} 
        onClick={handleProceed}
        disabled={!selectedCred}
      >
        Proceed
      </button>

      {/* Render ProceedPage1 as a popup */}
      <ProceedPage1 
        setPage1={setPage1}
        selectedCred={selectedCred}
        setCredId={setCredId}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default DerivedCredential1;