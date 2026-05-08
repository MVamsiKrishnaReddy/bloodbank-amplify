import { BrowserRouter } from 'react-router-dom';
import NavBar from './Hospital/NavBar';
import BloodNavBar from './blood/BloodNavBar';
import { AuthProvider, useAuth } from './contextapi/AuthContext';
import MainNavBar from './main/MainNavBar';
import AdminNavBar from './admin/AdminNavBar';

function AppContent() {
  const {
    isHospitalLoggedIn,
    isBloodBankLoggedIn,
    isOrganBankLoggedIn,
    isAdminLoggedIn,
  } = useAuth();

  return (
    <BrowserRouter>
      {isHospitalLoggedIn ? (
        <NavBar />
      ) : isBloodBankLoggedIn ? (
        <BloodNavBar />
      ) : isOrganBankLoggedIn ? (
        <OrganNavBar />
      ) : isAdminLoggedIn ? (
        <AdminNavBar />
      ) : (
        <MainNavBar />
      )}
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
