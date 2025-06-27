import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS


function BodyMain() {
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 100, // Animation duration in ms
      once: true, // Animation will run once
    });
  }, []);

  return (
    <>
      <div className="main-hero-box" style={{ position: 'relative', overflow: 'hidden' }}>


<Grid container >

  <Grid item xs={12} md={12}>

       <div className="main-hero-cutom-div">


            <div className="col-12 col-md-12 col-lg-12">

              <h1
                className="txt-2"
                style={{ color: '#09122C' }}
                data-aos="fade-up"
              >
                <span className="gradient-text" style={{ display: 'inline' }}>Job Switch?</span> Do It Silently, and Smartly.
                <br />
              </h1>

              <h2
                className="txt-4"
                data-aos="fade-up"
                data-aos-delay="100"
                style={{ color : '#777270'}}
              >
                Only for working professionals. Top companies reach out — you stay anonymous & employed.
              </h2>

            </div>

          
<div style={{ display : 'flex', justifyContent : 'center'}}>
            <div className="col-12 col-md-12 get-started-button-credit-card">
              <Link to="/professional/login" style={{ textDecoration: 'none' }}>
                <button
                  className="btn signup-btn-grad btn-g-fonts"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                >
                  Enroll now
                </button>
              </Link>
            </div>

            </div>

          </div>

  </Grid>



     

</Grid>


      </div>

      <style jsx>{`
        /* Keyframes for Emoji Animations */
        @keyframes bounce {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Rotate Animation for Rocket and Star (One-time rotation) */
        @keyframes rotateOnce {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Floating animation for celebration emoji */
        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default BodyMain;
