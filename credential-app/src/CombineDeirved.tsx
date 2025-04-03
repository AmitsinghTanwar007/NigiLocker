import React, { useState, useEffect } from 'react';

interface DerivedCredentialProps {
  setPage: (page: string) => void;
  setCredId: (id: string) => void;
}

const CombineDerived: React.FC<DerivedCredentialProps> = ({ setPage, setCredId }) => {
  const [derivedCreds, setDerivedCreds] = useState<string[]>([]);
  const [foundCreds, setFoundCreds] = useState<string[]>([]);
  const [selectedCreds, setSelectedCreds] = useState<string[]>([]);
  const [isCombining, setIsCombining] = useState(true);

  useEffect(() => {
    const derivedCredString = localStorage.getItem('derivedCred');
    if (derivedCredString) {
      try {
        const parsedCreds = JSON.parse(derivedCredString);
        if (Array.isArray(parsedCreds)) {
          setDerivedCreds(parsedCreds);
          const found = parsedCreds.filter(name => localStorage.getItem(name) !== null);
          setFoundCreds(found);
        }
      } catch (error) {
        console.error('Error parsing derivedCred from localStorage:', error);
      }
    }
  }, []);

  const handleCardClick = (credName: string) => {
    setCredId(credName);
    localStorage.setItem('credId', credName);
    setPage("credential-page");
  };

  const handleCheckboxChange = (credName: string) => {
    setSelectedCreds(prevSelected =>
      prevSelected.includes(credName)
        ? prevSelected.filter(name => name !== credName)
        : [...prevSelected, credName]
    );
  };

  const handlePresentCredential = () => {
    const combinedCredential: any = {
      "@context": ["https://www.w3.org/2018/credentials/v1", "https://schema.org"],
      "type": ["VerifiableCredential", "CombinedCredential"],
      "issuer": "https://DigiLocker.com",
      "credentialSubject": [],
      "issuanceDate": new Date().toISOString()
    };

    selectedCreds.forEach(credName => {
      const credData = localStorage.getItem(credName);
      if (credData) {
        try {
          const parsedCred = JSON.parse(credData);
          if (parsedCred.credentialSubject) {
            combinedCredential.credentialSubject.push(parsedCred.credentialSubject);
          }
        } catch (error) {
          console.error(`Error parsing credential ${credName}:`, error);
        }
      }
    });

    console.log("Combined Credential:", JSON.stringify(combinedCredential, null, 2));
    localStorage.setItem('combinedCredential', JSON.stringify(combinedCredential));
    localStorage.setItem('credId', 'combinedCredential');
    setIsCombining(false);
  };

  return (
    <div className="max-w-md mx-auto h-full p-6 bg-indigo-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Verifiable Credential</h2>
      <div className="flex justify-between items-center mb-8">
        <button 
          className="text-gray-700"
          onClick={() => setPage("derived-cred")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="mb-6 space-y-3 cursor-pointer">
        {foundCreds.length > 0 ? (
          foundCreds.map((credName) => (
            <div key={credName} className="flex items-center p-4 bg-white rounded-lg shadow">
              <input 
                type="checkbox" 
                className="mr-4" 
                checked={selectedCreds.includes(credName)} 
                onChange={() => handleCheckboxChange(credName)}
              />
              <div 
                className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mr-4" 
                onClick={() => handleCardClick(credName)}
              >
                {credName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800" onClick={() => handleCardClick(credName)}>{credName}</h3>
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
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4">
        {isCombining&&<button
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-full w-full max-w-xs text-lg font-medium"
          onClick={handlePresentCredential}
        >
            Combine Credentials
        </button>}
        {!isCombining&&<button
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-full w-full max-w-xs text-lg font-medium"
          onClick={()=>setPage("credential-page")}
        >
            Present Credential
        </button>}
      </div>
    </div>
  );
};

export default CombineDerived;
