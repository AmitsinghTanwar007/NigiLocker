import React, { useState, useEffect } from 'react';
import credentialsData from "../cred_file.json";

// Define the types for our credential data
interface CredentialSubject {
  name: string;
  identifier: string;
  gender?: string;
  dob?: string;
  Address?: string;
  City?: string;
  issuedBy: string;
}

interface VerifiableCredential {
  '@context': string | string[];
  type: string[];
  issuer: string;
  credentialSubject: CredentialSubject;
  issuanceDate: string;
}

interface CredentialData {
  '@context': string;
  type: string;
  verifiableCredential: VerifiableCredential[];
}

interface HomePageProps {
  setPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  // Sample credential data from provided JSON
  

  // State to store the credentials that have not been added yet
  const [availableCredentials, setAvailableCredentials] = useState<VerifiableCredential[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  useEffect(() => {
    // Get the added credentials from localStorage
    const addedCredentials = JSON.parse(localStorage.getItem('addedCred') || '[]');
    
    // Filter out credentials that are already added
    const filteredCredentials = credentialsData.verifiableCredential.filter(
      cred => !addedCredentials.includes(cred.type[1])
    );
    
    setAvailableCredentials(filteredCredentials);
  }, []);

  
  const handleClick = (credType: string) => {
    // Get current added credentials array
    const addedCredentials = JSON.parse(localStorage.getItem('addedCred') || '[]');
    
    // Add the new credential type if not already present
    if (!addedCredentials.includes(credType)) {
      const updatedAddedCredentials = [...addedCredentials, credType];
      
      // Update localStorage
      localStorage.setItem('addedCred', JSON.stringify(updatedAddedCredentials));
      
      // Update state to remove the selected credential
      setAvailableCredentials(prev => prev.filter(cred => cred.type[1] !== credType));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-full p-4 pb-24">
        <div className="flex justify-between items-center mb-8">
          <button className="text-gray-700" onClick={() => setPage("verifiable-credential")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        {/* Credentials List */}
        <div className="p-4 space-y-4">
          {availableCredentials.map((credential, index) => (
            <div 
              key={index}
              onClick={() => handleClick(credential.type[1])}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-xs">{credential.type[1].substring(0, 3)}</span>
                </div>
                <div>
                  <h2 className="font-semibold">{credential.type[1]}</h2>
                  <p className="text-sm text-gray-600">{credential.credentialSubject.issuedBy}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold">{credential.credentialSubject.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Created On</p>
                <p className="font-medium">{formatDate(credential.issuanceDate)}</p>
              </div>
            </div>
          ))}
          
          {availableCredentials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No available credentials to display
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default HomePage;