import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize state from sessionStorage
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    sessionStorage.getItem("isAdminLoggedIn") === "true"
  );
  const [isHospitalLoggedIn, setIsHospitalLoggedIn] = useState(
    sessionStorage.getItem("isHospitalLoggedIn") === "true"
  );
  const [isBloodBankLoggedIn, setIsBloodBankLoggedIn] = useState(
    sessionStorage.getItem("isBloodBankLoggedIn") === "true"
  );
  const [isOrganBankLoggedIn, setIsOrganBankLoggedIn] = useState(
    sessionStorage.getItem("isOrganBankLoggedIn") === "true"
  );

  const clearAllAuth = () => {
    setIsAdminLoggedIn(false);
    setIsHospitalLoggedIn(false);
    setIsBloodBankLoggedIn(false);
    setIsOrganBankLoggedIn(false);

    sessionStorage.removeItem("isAdminLoggedIn");
    sessionStorage.removeItem("isHospitalLoggedIn");
    sessionStorage.removeItem("isBloodBankLoggedIn");
    sessionStorage.removeItem("isOrganBankLoggedIn");

    sessionStorage.removeItem("Admin_user");
    sessionStorage.removeItem("Hospital_user");
    sessionStorage.removeItem("BloodBank_user");
    sessionStorage.removeItem("OrganBank_user");
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isHospitalLoggedIn,
        setIsHospitalLoggedIn,
        isBloodBankLoggedIn,
        setIsBloodBankLoggedIn,
        isOrganBankLoggedIn,
        setIsOrganBankLoggedIn,
        clearAllAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
