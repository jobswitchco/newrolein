import { Link } from 'react-router-dom';
import employerSearch from "../images/employersFind.svg";

function BodyMain() {
  return (
    <>
      {/* Inline critical CSS for LCP */}
      <style>
        {`

        .hero-txt-2 {
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(1.875rem, 5vw + 1rem, 4.125rem); /* ~30px to ~66px */
  font-weight: 600;
  color: #09122C;
  line-height: clamp(2.2rem, 1.0em + 2vh, 5.2rem);
  padding-left: clamp(1rem, 5vw, 6rem);
  padding-right: clamp(1rem, 5vw, 6rem);
  text-align: center;
}

          

          .hero-gradient-text {
            background: linear-gradient(90deg, #271bb3, #7c5fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          @media (max-width: 768px) {
            
       
             .hero-txt-4 {
                font-family: "Inter";
                padding-top: 2rem;
                font-size: 18px;
                font-weight: 400;
                line-height: 1.6;
                text-align: center;
                padding-left: 14%;
                padding-right: 14%;

              }

               .hero-main-hero-cutom-div {

                margin-top: 3rem;
                padding-top: 5rem;
                padding-bottom: 5rem;

              }

               .hero-signup-btn-grad {
   
    justify-content: center;
    align-items: center;
    background-size: 200% auto;
    color: white;
    display: flex;
    width: 100%;
    text-decoration: none;
    height: 50px;
    font-weight: 500;
    background-color: #261FB3;
    padding-left: 4rem;
    padding-right: 4rem;
    margin-top: 3rem;

  
  }

     .hero-signup-btn-grad:hover {
   
    justify-content: center;
    align-items: center;
    background-size: 200% auto;
    color: white;
    display: flex;
    width: 100%;
    text-decoration: none;
    height: 50px;
    font-weight: 500;
    background-color: #261FB3;
    padding-left: 4rem;
    padding-right: 4rem;
    margin-top: 3rem;

  
  }
          }

           @media (min-width: 576px) {
            
        

            .hero-txt-4 {
                    font-family: "Inter";
                    margin-top: 3.5rem;
                    font-size: 1.4rem;
                    font-weight: 400;
                    text-align: center;
                    padding-left: 25%;
                    padding-right: 25%;
                    line-height: 2rem;
                    color: '#777270';


                  }

                   .hero-main-hero-cutom-div {

                      margin-top: 4rem;
                      padding-left: 2rem;
                      padding-right: 2rem; 
                      padding-top: 6rem;
                      padding-bottom: 6rem;
                    }

                     .hero-signup-btn-grad {
   
                      justify-content: center;
                      align-items: center;
                      background-size: 200% auto;
                      color: white;
                      display: flex;
                      width: 100%;
                      text-decoration: none;
                      height: 50px;
                      font-weight: 500;
                      background-color: #261FB3;
                      padding-left: 4rem;
                      padding-right: 4rem;
                      margin-top: 3rem;
                    
                    }

                  .hero-signup-btn-grad:hover {
                  
                    justify-content: center;
                    align-items: center;
                    background-size: 200% auto;
                    color: white;
                    display: flex;
                    width: 100%;
                    text-decoration: none;
                    height: 50px;
                    font-weight: 500;
                    background-color: #261FB3;
                    padding-left: 4rem;
                    padding-right: 4rem;
                    margin-top: 3rem;

                  
                  }

          }
        `}
      </style>

        <div className="hero-main-hero-cutom-div">
          <div className="col-12 col-md-12 col-lg-12">
            <h1 className="hero-txt-2">
              <span className="hero-gradient-text" >
                Job Switch?
              </span>
              <br />
              Skip the Posts. <br />
              Ditch the Resumes.
              <br />
            </h1>

            <h2 className="hero-txt-4">
              Only for working IT professionals — no resumes, no job posts.
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/professional/login" style={{ textDecoration: 'none' }}>
                <button className="btn hero-signup-btn-grad btn-g-fonts">Enroll now</button>
              </Link>
            </div>
        </div>


      <div className="container py-1 px-5">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-12 col-md-8 mb-4 mb-md-0">
            <h1 className="fw-medium text-dark mb-4" style={{ fontSize: '26px' }}>
              Stop applying for Jobs— <br />
              Let employers find the talent they need.
            </h1>

            <div className="row">
              <div className="col-12 col-md-6 mb-4 mb-md-0">
                <p className="fw-medium mb-1">Create Account</p>
                <p style={{ color: '#777270', fontSize: '16px' }}>
                  Create a{' '}
                  <span
                    style={{
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      color: '#333446',
                    }}
                  >
                    forever-free
                  </span>{' '}
                  account and join a network of verified professionals.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <p className="fw-medium mb-1">Employment Details</p>
                <p style={{ color: '#777270', fontSize: '16px' }}>
                  Add your current and past roles to help employers understand your experience
                  and expertise.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-12 col-md-4">
            <img
              src={employerSearch}
              alt="employerSearch"
              className="img-fluid rounded"
              loading="lazy"
              width="400"
              height="300"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BodyMain;
