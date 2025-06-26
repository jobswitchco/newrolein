import './styles/Home.module.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import VerifyWorkMail from './components/Employee/VerifyWorkMail.js'
import { LocalizationProvider } from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import UserSideNavBar from './components/Employee/UserSideNavBar.js';
import EmployerSideNavBar from './components/Employer/EmployerSideNavBar.js';
import Support from './components/Employee/Support.js';
import Profile from './components/Employee/Profile.js';
import ForgotPassword from './components/Employee/ForgotPassword.js';
import LandingPage from './components/LandingPage.js';
import Pricing from './components/Pricing.js';
import Terms from './components/Terms.js';
import PrivacyPolicy from './components/PrivacyPolicy.js';
import CancellationRefund from './components/CancellationRefund.js';
import ShippingPolicy from './components/ShippingPolicy.js';
import ContactUs from './components/ContactUs.js';
import ProfileSettings from './components/Employee/Profile.js';
import AccountDetails from './components/Employee/AccountDetails.js';
import EmployerAccountDetails from './components/Employer/AccountDetails.js';
import GoogleApiDisclosure from './components/GoogleApiDisclosure.js';
import DisclosurePolicy from './components/DisclosurePolicy.js';
import TrustCenter from './components/TrustCenter.js';
import AboutUs from './components/AboutUs.js';
import YouTubeDisclosure from './components/YoutubeApiDisclosure.js';
import Security from './components/Security.js';
import EmployeeLogin from './components/Employee/GoogleUserLogin.js';
import CareerDetails from './components/Employee/CareerDetails.js';
import ProfileBasedDiscovery from './components/ProfileDiscovery.js';
import DirectEmployerOutreach from './components/EmployerReachout.js';
import FasterHiring from './components/FasterHiring.js';
import EmployerLogin from './components/Employer/EmployerLogin.js';
import EmployerSignup from './components/Employer/EmployerSignup.js';
import AdminSideBar from './components/Admin/AdminSideBar.js';
import AllEmployers from './components/Admin/AllEmployers.js';
import ProfessionalsTable from './components/Employer/AllProfessionals.js';
import ShortlistTable from './components/Employer/ShortlistTable.js';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import InvitedTable from './components/Employer/InvitedTable.js';
import InvitationsTable from './components/Employee/InvitationsTable.js';
import DashboardOverview from './components/Employee/Dashboard.js';





function App() {

  return (
    <LocalizationProvider dateAdapter= {AdapterDateFns}>
    <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>


      <Router>
        <Routes>
          <Route path="/" element={< LandingPage/>}/>
          <Route path="/professional/login" element={< EmployeeLogin/>}/>
           <Route path="/verify/workmail" element={< VerifyWorkMail/>}/>
           <Route path="/forgotPassword" element={<ForgotPassword/>}/>
           <Route path="/onboard/agency/pricing" element={<Pricing/>}/>
           <Route path="/terms" element={<Terms/>}/>
           <Route path="/privacy_policy" element={<PrivacyPolicy/>}/>
           <Route path="/cancellation_refund" element={<CancellationRefund/>}/>
           <Route path="/shipping_policy" element={<ShippingPolicy/>}/>
           <Route path="/contact" element={<ContactUs/>}/>
           <Route path="/profile" element={<ProfileSettings/>}/>
           <Route path="/google_api_disclosure" element={<GoogleApiDisclosure/>}/>
           <Route path="/disclosure_policy" element={<DisclosurePolicy/>}/>
           <Route path="/trust_center" element={<TrustCenter/>}/>
           <Route path="/about_us" element={<AboutUs/>}/>
           <Route path="/youtube_api_disclosure" element={<YouTubeDisclosure/>}/>
           <Route path="/security" element={<Security/>}/>
           <Route path="/profile-based-discovery" element={<ProfileBasedDiscovery/>}/>
           <Route path="/employer-reachout" element={<DirectEmployerOutreach/>}/>
           <Route path="/faster-hiring" element={<FasterHiring/>}/>
          <Route path="/employer/login" element={<EmployerLogin />}/>


          <Route path="/professional/*" element={< UserSideNavBar />}>
          <Route path="support" element={<Support/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="account/details" element={<AccountDetails/>}/>
          <Route path="career_details" element={<CareerDetails/>}/>
          <Route path="invitations" element={<InvitationsTable/>}/>
          <Route path="dashboard" element={<DashboardOverview/>}/>
          </Route>

        <Route path="/employer/*" element={< EmployerSideNavBar />}>
          <Route path="all_professionals" element={<ProfessionalsTable/>}/>
          <Route path="shortlisted_candidates" element={<ShortlistTable/>}/>
          <Route path="invited_candidates" element={<InvitedTable/>}/>
          <Route path="account/details" element={<EmployerAccountDetails/>}/>


         
         </Route>

          <Route path="/admin/*" element={< AdminSideBar />}>
          <Route path="employer_signup" element={<EmployerSignup />}/>
          <Route path="all_employers" element={<AllEmployers />}/>

         
         </Route>


        
        {/* Any other global routes that don't depend on the sidebar */}
        <Route path="/" element={<Outlet />}>
          {/* ... other routes */}
        </Route>


        </Routes>

        

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
