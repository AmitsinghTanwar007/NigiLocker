import { useEffect, useState } from "react";
import './Nigi.css';
import credentialsData from "../cred_file.json";
import deleteIcon from "./delete.png"; // Ensure this image exists in your project

interface NigiLockerProps {
  setPage1: (page: string) => void;
  setCred: (cred: string) => void;
  setSelectedCred: (cred: string) => void;
  setCredId: (credId: string) => void;
}

function NigiLocker1({ setPage1, setCred, setSelectedCred, setCredId }: NigiLockerProps) {
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
  const [derivedCreds, setDerivedCreds] = useState<string[]>([]);
  const [foundCreds, setFoundCreds] = useState<string[]>([]);

  useEffect(() => {
    const addedCred = JSON.parse(localStorage.getItem("addedCred") || "[]");
    if (credentialsData?.verifiableCredential) {
      const filteredCredentials = credentialsData.verifiableCredential.filter(
        (cred) => addedCred.includes(cred.type[1])
      );
      setCredentials(filteredCredentials);
    }
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

  const handleCardClick = (value: Credential) => {
    setPage1("presentable-page");
    setCred(value.type[1]);
  };

  const handleDelete = (credType: string, e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation(); // Prevents triggering handleCardClick

    const updatedCreds = credentials.filter(cred => cred.type[1] !== credType);
    setCredentials(updatedCreds);

    const addedCred = JSON.parse(localStorage.getItem("addedCred") || "[]");
    const updatedAddedCred = addedCred.filter((type: string) => type !== credType);
    localStorage.setItem("addedCred", JSON.stringify(updatedAddedCred));
  };

  const handleDelete1 = (credName: string, e: React.MouseEvent<HTMLImageElement>) => {
    localStorage.removeItem(credName);
    const updatedFoundCreds = foundCreds.filter(name => name !== credName);
    setFoundCreds(updatedFoundCreds);
    e.stopPropagation(); // Prevents triggering handleCardClick
  }
  const handleDerivedCredential = () => {
    setPage1("derived-cred");
  };

  const handleCardClick1 = (credName: string) => {
    setCredId(credName);
    localStorage.setItem('credId', credName);
    setPage1("credential-page");
  };

  return (
    <div className="bg-gradient-to-b from-purple-100 to-white overflow-y-auto h-[940px] relative flex flex-col items-center">
      <div className="mx-auto max-w-full p-4 pb-8 overflow-y-auto">
         {/* Header */}
         {/* <div className="flex justify-between items-center mb-8">
          <button 
            className="text-gray-700"
            onClick={() => setPage1("verifiable-credential")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div> */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Verifiable Credential</h1>
          
        {credentials.map((cred, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
            onClick={() => handleCardClick(cred)}
          >
            {/* Delete Icon */}
            <img
              src={deleteIcon}
              alt="Delete"
              className="absolute top-3 right-3 h-5 w-5 cursor-pointer"
              onClick={(e) => handleDelete(cred.type[1], e)}
            />
            
            <h2 className="text-xl font-medium text-gray-700">{cred.type[1]}</h2>
            <p className="text-gray-500 text-sm">{cred.credentialSubject.issuedBy}</p>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{cred.credentialSubject.name}</h3>
            <p className="text-gray-500 text-xs">Created On</p>
            <p className="text-lg text-gray-800">{cred.issuanceDate}</p>
          </div>
        ))}
        <div className="mb-6 space-y-3 w-[400px] cursor-pointer z-0">
        {foundCreds.length > 0 ? (
          foundCreds.map((credName) => (
            <div 
              key={credName} 
              className="flex flex-col p-4 bg-white h-24 rounded-3xl shadow-lg shadow-gray-100 relative hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
              onClick={() => handleCardClick1(credName)}
            >
              <img
              src={deleteIcon}
              alt="Delete"
              className="absolute top-3 right-3 h-5 w-5 cursor-pointer z-10" onClick={(e)=>handleDelete1(credName,e)}
            />
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mr-4">
                  {credName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-gray-800">{credName}</h3>
                  <p className="text-xs text-gray-500">
                    Created On: {new Date().toISOString().split('T')[0]}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-4 ml-80 italic">Derived</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 py-6">No valid credentials found</p>
        )}
      </div>
      </div>

      <div className="flex justify-center mt-6 mb-3">
        <button
          className="bg-indigo-600 text-white px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          onClick={handleDerivedCredential}
        >
          Create Derived Credentials
        </button>
      </div>

      <div className="flex justify-center mt-6 mb-3">
        <button
          className="bg-indigo-600 text-white px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          onClick={() => setPage1("home-page1")}
        >
          Add Credential
        </button>
      </div>
    </div>
  );
}

export default NigiLocker1;
