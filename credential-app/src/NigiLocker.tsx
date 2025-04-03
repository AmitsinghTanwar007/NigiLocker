import { useEffect, useState } from "react";
import './Nigi.css';
import credentialsData from "./cred_file.json";
import deleteIcon from "./delete.png"; // Ensure this image exists in your project

interface NigiLockerProps {
  setPage: (page: string) => void;
  setCred: (cred: string) => void;
}

function NigiLocker({ setPage, setCred }: NigiLockerProps) {
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
    const addedCred = JSON.parse(localStorage.getItem("addedCred") || "[]");
    if (credentialsData?.verifiableCredential) {
      const filteredCredentials = credentialsData.verifiableCredential.filter(
        (cred) => addedCred.includes(cred.type[1])
      );
      setCredentials(filteredCredentials);
    }
  }, []);

  const handleCardClick = (value: Credential) => {
    setPage("presentable-page");
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

  const handleDerivedCredential = () => {
    setPage("derived-cred");
  };

  return (
    <div className="bg-gradient-to-b from-purple-100 to-white overflow-y-auto relative">
      <div className="mx-auto max-w-full p-4 pb-24">
         {/* Header */}
         <div className="flex justify-between items-center mb-8">
          <button 
            className="text-gray-700"
            onClick={() => setPage("bengaluru-zoo")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
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
      </div>

      <div className="flex justify-center mt-6 mb-3">
        <button
          className="bg-indigo-600 text-white px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          onClick={handleDerivedCredential}
        >
          View Derived Credentials
        </button>
      </div>

      <div className="flex justify-center mt-6 mb-3">
        <button
          className="bg-indigo-600 text-white px-10 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          onClick={() => setPage("home-page")}
        >
          Add Credential
        </button>
      </div>
    </div>
  );
}

export default NigiLocker;
