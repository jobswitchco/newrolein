import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function BillingAndPlans() {
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8001/employersOn";
  const [ loading, setLoading ] = useState(false);

    const handleSessionExpired = () => {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          navigate('/employer/login');
        }, 2000);
      };
  

  useEffect(() => {

     const verifyToken = async () => {
            setLoading(true);
          
            try {
              const res = await axios.get(`${baseUrl}/verify-login-token`, { withCredentials: true });
          
              if (res.data.valid) {
                    await fetchSubscription();

              } else {
                handleSessionExpired();
              }
            } catch (error) {
              if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                handleSessionExpired();
              } else {
                toast.error("Network error, please try again later.");
                handleSessionExpired();
    
              }
            } finally {
              setLoading(false);
            }
          };

      verifyToken();
  

  }, []);


    const fetchSubscription = async () => {

      try {
        const res = await axios.get(`${baseUrl}/get-subscription-details`, {
          withCredentials: true
        });
        setSubscription(res.data.subscription);
      } catch (err) {
        console.error('Error fetching subscription:', err);
      }
      
    };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleUpgrade = () => {
    if (subscription?.planId) {
      navigate(`/employer/upgrade/${subscription.planId}`);
    }
  };

  if (!subscription) {
    return <p className="text-center my-5">Loading current plan...</p>;
  }

  return (
<>
    { loading ? ( <Box
                      sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999
                      }}
                    >
                      <CircularProgress />
                    </Box>) : (
                        <div className="container row mx-auto justify-content-center mb-5">

        <div className="col-12 col-md-6 col-lg-6 py-3">

      <div className="border border-primary rounded p-4 text-center">
              <p><span className="pricing-txt">{subscription.plan_name}</span></p>

          <p><span className="pricing-txt-price text-center"> ₹ {subscription.price}</span>(Incl. GST)</p>

        <div className="features-details">

            <div className="bb-txt-3 cussLine">
<span className="material-icons me-3">account_box</span>
  <p>Unlimited profiles</p>
</div>

<div className="bb-txt-3 cussLine">
<span className="material-icons me-3">list_alt</span>
  <p>Unlimited shortlists</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">mark_email_read</span>
  <p>{subscription.invitations_per_month} Invitations per month</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">chat_bubble</span>
  <p>{subscription.messaging}</p>
</div>


<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">filter_list</span>
  <p>Advanced filters & search</p>
</div>

<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">support_agent</span>
  <p>{subscription.support}</p>
</div>

{ subscription.plan_name === "Pro Agency" ? (
<div className="bb-txt-3 cussLine">
<span class="material-icons me-3">batch_prediction</span>
  <p>Access to early beta features (e.g., AI match scoring)</p>
</div>
) : ('')}

<div className="bb-txt-3 cussLine">
  <span className="material-icons me-3">calendar_month</span>
  <p>Plan Ends : {formatDate(subscription.plan_ends_at)}</p>
</div>





</div>

      

        <div className="text-center mt-4">
          <button
            className="btn btn-primary px-4"
            onClick={handleUpgrade}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
      </div>
    </div>
)}
</>
  );
}

export default BillingAndPlans;
