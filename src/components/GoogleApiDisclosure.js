import Navbar from './Navbar'
import Footer from './Footer'


function GoogleApiDisclosure() {


  return (
   <>

      <header>
        <title>Security and Data Protection | Newrole</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </header>
   <Navbar />


    <div className="container">

        <div className = "google-api-disclosure-text">Google API Disclosure</div>

        <div className = "google-api-disclosure-text-desc">Newrole's use and transfer of information received from Google APIs to any other app will adhere to <span className="span-txt-70"><a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" style={{ textDecoration : 'none', color : 'blue'}}>Google API Services User Data Policy</a></span>, including the Limited Use requirements.</div>
    </div>
    <Footer />
   </>
  )
}

export default GoogleApiDisclosure