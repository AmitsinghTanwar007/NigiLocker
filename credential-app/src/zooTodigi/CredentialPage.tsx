import React, { useEffect, useState } from "react";

interface CredentialPageProps {
  setPage: (page: string) => void;
}

const CredentialPage: React.FC<CredentialPageProps> = ({ setPage }) => {
  const [credentialId, setCredentialId] = useState<string | null>(null);
  const [credentialData, setCredentialData] = useState<object | null>(null);

  useEffect(() => {
    const storedCredId = localStorage.getItem("credId");
    if (storedCredId) {
      setCredentialId(storedCredId);
      const storedCredential = localStorage.getItem(storedCredId);
      if (storedCredential) {
        setCredentialData(JSON.parse(storedCredential));
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[950px] bg-purple-100 p-6">
        <div className="flex justify-between items-center relative -top-16 -left-48">
          <button className="text-gray-700" onClick={() => setPage("verifiable-credential")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      <h1 className="text-2xl font-semibold text-purple-700 mb-4">Selected Credential</h1>
      {credentialId && credentialData ? (
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
          <p className="text-lg font-medium text-gray-700 mb-2">Credential ID: {credentialId}</p>
          <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-auto">
            {JSON.stringify(credentialData, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-gray-700">No credential found.</p>
      )}
      <button className="mt-6 bg-purple-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-800" onClick={() => setPage("redirect-page")}>
        Create Verifiable Presentation
      </button>
    </div>
  );
};

export default CredentialPage;
