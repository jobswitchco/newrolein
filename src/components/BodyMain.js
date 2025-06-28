import { Link } from 'react-router-dom';
import employerSearch from "../images/employersFind.svg";


function BodyMain() {

  return (
    <>
      <div className="main-hero-box" style={{ position: 'relative', overflow: 'hidden' }}>




       <div className="main-hero-cutom-div">


            <div className="col-12 col-md-12 col-lg-12">

              <h1
                className="txt-2"
              >
                <span className="gradient-text" style={{ display: 'inline', color: '#261FB3' }}>Job Switch?</span> 
                <br />Skip the Posts. <br />Ditch the Resumes.
                <br />
              </h1>

              <h2
                className="txt-4"
                style={{ color : '#777270'}}
              >
                Only for working IT professionals. Top companies reach out — no resumes, no job posts.
              </h2>

            </div>

          
<div style={{ display : 'flex', justifyContent : 'center'}}>
            <div className="col-12 col-md-12 get-started-button-credit-card">
              <Link to="/professional/login" style={{ textDecoration: 'none' }}>
                <button
                  className="btn signup-btn-grad btn-g-fonts"
                >
                  Enroll now
                </button>
              </Link>
            </div>

            </div>

          </div>

 


      </div>

        <div className="container py-1 px-5">
      <div className="row align-items-center">
        {/* Left Content - 8 columns on md and up */}
        <div className="col-12 col-md-8 mb-4 mb-md-0">
          <h1 className="fw-medium text-dark mb-4" style={{ fontSize: '26px' }}>
            Stop applying for Jobs— <br/>Let employers find the talent they need.
          </h1>

          <div className="row">
            {/* Column 1 */}
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

            {/* Column 2 */}
            <div className="col-12 col-md-6">
              <p className="fw-medium mb-1">Employment Details</p>
              <p style={{ color: '#777270', fontSize: '16px' }}>
                Add your current and past roles to help employers understand your experience
                and expertise.
              </p>
            </div>
          </div>
        </div>

        {/* Right Image - 4 columns on md and up */}
        <div className="col-12 col-md-4">
          <img
            src={employerSearch}
            alt="employerSearch"
            className="img-fluid rounded"
            loading="lazy"
          />
        </div>
      </div>
    </div>

     
    </>
  );
}

export default BodyMain;
