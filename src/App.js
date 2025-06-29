// import logo from './logo.svg';
import './styles/Home.module.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense } from 'react';

// Non-lazy component
import LandingPage from './components/LandingPage.js';

// Lazy-loaded components
const VerifyWorkMail = lazy(() => import('./components/Employee/VerifyWorkMail'));
const UserSideNavBar = lazy(() => import('./components/Employee/UserSideNavBar'));
const EmployerSideNavBar = lazy(() => import('./components/Employer/EmployerSideNavBar'));
const Support = lazy(() => import('./components/Employee/Support'));
const Profile = lazy(() => import('./components/Employee/Profile'));
const ForgotPassword = lazy(() => import('./components/Employee/ForgotPassword'));
const Pricing = lazy(() => import('./components/Pricing'));
const Terms = lazy(() => import('./components/Terms'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const CancellationRefund = lazy(() => import('./components/CancellationRefund'));
const ShippingPolicy = lazy(() => import('./components/ShippingPolicy'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const ProfileSettings = lazy(() => import('./components/Employee/Profile'));
const AccountDetails = lazy(() => import('./components/Employee/AccountDetails'));
const EmployerAccountDetails = lazy(() => import('./components/Employer/AccountDetails'));
const GoogleApiDisclosure = lazy(() => import('./components/GoogleApiDisclosure'));
const DisclosurePolicy = lazy(() => import('./components/DisclosurePolicy'));
const TrustCenter = lazy(() => import('./components/TrustCenter'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const YouTubeDisclosure = lazy(() => import('./components/YoutubeApiDisclosure'));
const Security = lazy(() => import('./components/Security'));
const EmployeeLogin = lazy(() => import('./components/Employee/GoogleUserLogin'));
const CareerDetails = lazy(() => import('./components/Employee/CareerDetails'));
const ProfileBasedDiscovery = lazy(() => import('./components/ProfileDiscovery'));
const DirectEmployerOutreach = lazy(() => import('./components/EmployerReachout'));
const FasterHiring = lazy(() => import('./components/FasterHiring'));
const EmployerLogin = lazy(() => import('./components/Employer/EmployerLogin'));
const EmployerSignup = lazy(() => import('./components/Employer/EmployerSignup'));
const AdminSideBar = lazy(() => import('./components/Admin/AdminSideBar'));
const AllEmployers = lazy(() => import('./components/Admin/AllEmployers'));
const ProfessionalsTable = lazy(() => import('./components/Employer/AllProfessionals'));
const ShortlistTable = lazy(() => import('./components/Employer/ShortlistTable'));
const InvitedTable = lazy(() => import('./components/Employer/InvitedTable'));
const InvitationsTable = lazy(() => import('./components/Employee/InvitationsTable'));
const DashboardOverview = lazy(() => import('./components/Employee/Dashboard'));

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="App">
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/professional/login" element={<EmployeeLogin />} />
              <Route path="/verify/workmail" element={<VerifyWorkMail />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/onboard/agency/pricing" element={<Pricing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy_policy" element={<PrivacyPolicy />} />
              <Route path="/cancellation_refund" element={<CancellationRefund />} />
              <Route path="/shipping_policy" element={<ShippingPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/google_api_disclosure" element={<GoogleApiDisclosure />} />
              <Route path="/disclosure_policy" element={<DisclosurePolicy />} />
              <Route path="/trust_center" element={<TrustCenter />} />
              <Route path="/about_us" element={<AboutUs />} />
              <Route path="/youtube_api_disclosure" element={<YouTubeDisclosure />} />
              <Route path="/security" element={<Security />} />
              <Route path="/profile-based-discovery" element={<ProfileBasedDiscovery />} />
              <Route path="/employer-reachout" element={<DirectEmployerOutreach />} />
              <Route path="/faster-hiring" element={<FasterHiring />} />
              <Route path="/employer/login" element={<EmployerLogin />} />

              <Route path="/professional/*" element={<UserSideNavBar />}>
                <Route path="support" element={<Support />} />
                <Route path="profile" element={<Profile />} />
                <Route path="account/details" element={<AccountDetails />} />
                <Route path="career_details" element={<CareerDetails />} />
                <Route path="invitations" element={<InvitationsTable />} />
                <Route path="dashboard" element={<DashboardOverview />} />
              </Route>

              <Route path="/employer/*" element={<EmployerSideNavBar />}>
                <Route path="all_professionals" element={<ProfessionalsTable />} />
                <Route path="shortlisted_candidates" element={<ShortlistTable />} />
                <Route path="invited_candidates" element={<InvitedTable />} />
                <Route path="account/details" element={<EmployerAccountDetails />} />
              </Route>

              <Route path="/admin/*" element={<AdminSideBar />}>
                <Route path="employer_signup" element={<EmployerSignup />} />
                <Route path="all_employers" element={<AllEmployers />} />
              </Route>

              <Route path="/" element={<Outlet />}>
                {/* Other global routes */}
              </Route>
            </Routes>
          </Suspense>
        </Router>

        <ToastContainer
          position="top-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 15000 }}
        />
      </div>
    </LocalizationProvider>
  );
}

export default App;
