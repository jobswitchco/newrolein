import Navbar from './Navbar'
import Footer from './Footer'


function GoogleApiDisclosure() {


  return (
   <>

        <Helmet>
            <title>Security and Data Protection | Newrole</title>
            <meta name="description" content="Learn how Newrole ensures your data is protected with secure infrastructure, encryption, and industry-standard privacy practices for professionals and employers." />

            <meta
              property="og:title"
              content="Security and Data Protection | Newrole"
            />
            <meta
              property="og:description"
              content="Learn how Newrole ensures your data is protected with secure infrastructure, encryption, and industry-standard privacy practices for professionals and employers."
            />
            <meta property="og:type" content="website" />
          </Helmet>

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