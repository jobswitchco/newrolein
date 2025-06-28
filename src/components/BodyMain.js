import { Link } from 'react-router-dom';

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

     
    </>
  );
}

export default BodyMain;
