import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KoriteBanner from './components/KoriteBanner';
import HomePage from './pages/HomePage';
import ProviderLoginPage from './pages/ProviderLoginPage';
import ProviderRegisterPage from './pages/ProviderRegisterPage';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderProfilePage from './pages/ProviderProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConnexionPage from './pages/ConnexionPage';
import CategoryPage from './pages/CategoryPage';
import ServicesPage from './pages/ServicesPage';
import AllProvidersPage from './pages/AllProvidersPage';
import PrestataireRegisterPage from './pages/PrestataireRegisterPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProvidersPage from './pages/AdminProvidersPage';
import AdminHomePage from './pages/AdminHomePage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminStatisticsPage from './pages/AdminStatisticsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminMessagesPage from './pages/AdminMessagesPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminProviderDetailPage from './pages/AdminProviderDetailPage';
import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/AdminLayout';
import ProviderPublicPage from './pages/ProviderPublicPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import JojOfficialProvidersPage from './pages/JojOfficialProvidersPage';
import JojMissionsPage from './pages/JojMissionsPage';
import JojProviderDetailPage from './pages/JojProviderDetailPage';
import OfficialProvidersListPage from './pages/OfficialProvidersListPage';
import OfficialProviderDetailPage from './pages/OfficialProviderDetailPage';
import ServiceSubcategoryPage from './pages/ServiceSubcategoryPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ChatBot from './components/ChatBot';
import './index.css';

function App() {
  return (
    <Router>
      <KoriteBanner />
      <ChatBot />
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Provider Routes */}
        <Route path="/provider/login" element={<ProviderLoginPage />} />
        <Route path="/provider/register" element={<ProviderRegisterPage />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/profile" element={<ProviderProfilePage />} />
        
        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        
        {/* Public Routes */}
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/categories/:id" element={<CategoryDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:category/:subcategory" element={<ServiceSubcategoryPage />} />
        <Route path="/prestataires" element={<AllProvidersPage />} />
        <Route path="/prestataires/:id" element={<ProviderPublicPage />} />
        <Route path="/prestataire" element={<PrestataireRegisterPage />} />
        <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
        
        {/* Payment Routes */}
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes - Protégées avec Layout */}
        <Route path="/admin" element={<AdminGuard><AdminLayout><AdminHomePage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
        <Route path="/admin/prestataires" element={<AdminGuard><AdminLayout><AdminProvidersPage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/prestataires/:id" element={<AdminGuard><AdminLayout><AdminProviderDetailPage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/profil" element={<AdminGuard><AdminLayout><AdminProfilePage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/statistiques" element={<AdminGuard><AdminLayout><AdminStatisticsPage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/etudiants" element={<AdminGuard><AdminLayout><AdminStudentsPage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/messages" element={<AdminGuard><AdminLayout><AdminMessagesPage /></AdminLayout></AdminGuard>} />
        <Route path="/admin/notifications" element={<AdminGuard><AdminLayout><AdminNotificationsPage /></AdminLayout></AdminGuard>} />
        
        {/* JOJ Public Routes */}
        <Route path="/joj/official-providers" element={<JojOfficialProvidersPage />} />
        <Route path="/joj/official-providers/:id" element={<JojProviderDetailPage />} />
        <Route path="/joj/missions" element={<JojMissionsPage />} />
        
        {/* Official Providers Routes */}
        <Route path="/prestataires-officiels" element={<OfficialProvidersListPage />} />
        <Route path="/prestataires-officiels/:id" element={<OfficialProviderDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
