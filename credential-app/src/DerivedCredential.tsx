import React, { useState, useEffect } from 'react';

interface Credential {
  name: string;
}

interface DerivedCredentialProps {
  setPage: (page: string) => void;
  setSelectedCred: (cred: string) => void;
  selectedCred: string; // Add this property
  setCredId: (id: string) => void; // Add this property
}

const DerivedCredential: React.FC<DerivedCredentialProps> = ({ setPage, setSelectedCred,selectedCred , setCredId}) => {
  const [derivedCreds, setDerivedCreds] = useState<string[]>([]);
  const [foundCreds, setFoundCreds] = useState<string[]>([]);

  useEffect(() => {
    // Get the array of credential names from localStorage
    localStorage.setItem('derivedCred', JSON.stringify(['age less than 15', 'age Greater than 60', 'City']));
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


  const handleCardClick = (credName: string) => {
    setCredId(credName);
    localStorage.setItem('credId', credName);
    setPage("credential-page");
  };

  const handleProceed = () => {
    if (selectedCred) {
      setPage('proceed-page');
    } else {
      alert('Please select a credential to proceed');
    }
  };

  return (
    <div className="max-w-md mx-auto h-full p-6 bg-indigo-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Verifiable Credential</h2>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            className="text-gray-700"
            onClick={() => setPage("verifiable-credential")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

      <div className="mb-6 space-y-3 cursor-pointer">
        {foundCreds.length > 0 ? (
          foundCreds.map((credName) => (
            <div key={credName} className="flex items-center p-4 bg-white rounded-lg shadow" onClick={()=>handleCardClick(credName)}>
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mr-4" >
                {credName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{credName}</h3>
                <p className="text-xs text-gray-500">
                  Created On: {new Date().toISOString().split('T')[0]}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-6">No valid credentials found</p>
        )}
      </div>
      
      <div className="mb-6">
        <label htmlFor="credential-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Credential:
        </label>
        <select 
          id="credential-select" 
          value={selectedCred} 
          onChange={handleSelectChange}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">-- Select a credential --</option>
          {derivedCreds.map((cred) => (
            <option key={cred} value={cred}>
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
      <button 
        className='w-full py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
        onClick={() => setPage('combine-derived')}
      >
        Combination of Derived Credentials
      </button>
    </div>
  );
};

export default DerivedCredential;