import { useEffect, useState } from "react";
import './Nigi.css';
import credentialsData from "./cred_file.json";

interface NigiLockerProps {
  setPage: (page: string) => void;
  setCred: (cred: string) => void;
}

function NigiLocker({ setPage,setCred }: NigiLockerProps) {
  interface Credential {
    "@context": string[];
    type: string[];
    issuer: string;
    credentialSubject: {
      name: string;
      identifier: string;
      issuedBy: string;
    };
    issuanceDate: string;
  }

  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    if (credentialsData?.verifiableCredential) {
      setCredentials(credentialsData.verifiableCredential);
    }
  }, []);

  const handleCardClick = (value: Credential) => {
    setPage("presentable-page");
    console.log(value.credentialSubject.name);
    setCred(value.type[1]); 
  };

  const handleDerivedCredential = () => {
    setPage("derived-cred");
    };

  return (
    <div className="bg-gradient-to-b from-purple-100 to-white overflow-y-auto relative">
      <div className="mx-auto max-w-full p-4 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button className="text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button className="text-gray-700 rounded-full h-8 w-8 flex items-center justify-center border border-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Verifiable Credential</h1>

        {/* Credential Cards */}
        {credentials.map((cred, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleCardClick(cred)}
          >
            <div className="flex items-start mb-5">
              <div className="h-12 w-12 mr-4 flex-shrink-0 flex items-center justify-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-800 font-bold">
                  {cred.type[1] || "Credential"}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-700">{cred.type[1]}</h2>
                <p className="text-gray-500 text-sm">{cred.credentialSubject.issuedBy}</p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{cred.credentialSubject.name}</h3>
            <p className="text-gray-500 text-xs">Created On</p>
            <p className="text-lg text-gray-800">{cred.issuanceDate}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 mb-3">
  <button 
    className="bg-indigo-600 text-white px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
    onClick={() => handleDerivedCredential()}
  >
    Derived Credential
  </button>
</div>

 {/* Add Credential Button */}
<div className="flex justify-center mt-6 mb-3">
  <button 
    className="bg-indigo-600 text-white px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
    onClick={() => alert('Add Credential Clicked!')}
  >
    Add Credential
  </button>
</div>

    </div>
  );
}

export default NigiLocker;