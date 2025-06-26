// // import Head from 'next/head'
// import React, { useEffect } from 'react';
// import Navbar from '../components/Navbar'
// import BodyMain from '../components/BodyMain'
// import Accordian from '../components/Accordian'
// import Footer from '../components/Footer'
// import BodyBlocks from '../components/BodyBlocks'
// import { Helmet } from "react-helmet";
// import BodyBlocksTabs from './BodyBlocksTabs';
// // import Script from 'next/script'

// export default function LandingPage() {

//   useEffect(() => {
//     // Ensure dataLayer is defined before calling gtag
//     window.dataLayer = window.dataLayer || [];
//     function gtag() {
//       window.dataLayer.push(arguments);
//     }
//     gtag('js', new Date());
//     gtag('config', 'G-D1X0WBG5EL');
//   }, []);

//   return (

//     <>

//         <Helmet>
//         <title>Turn Audio into Stunning Videos | AudioReel</title>
//         <meta name="description" content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!" />
//         <meta property="og:title" content="Turn Audio into Stunning Videos | AudioReel" />
//         <meta property="og:description" content="Transform your audio into stunning videos with AI-powered tools. Perfect for creators, speakers, and audiobooks. Create professional videos instantly!" />
//         <meta property="og:type" content="website" />
//         <link rel="canonical" href="https://www.audioreel.io" />
//         <meta name="google-site-verification" content="Y8Lu6AhM03esRTZg_PR1fnHPfEv-QVz70Px3WMg2boc" />
//         <script async src="https://www.googletagmanager.com/gtag/js?id=G-D1X0WBG5EL"></script>

//       </Helmet>

//       <Navbar />
//       <BodyMain />
//       {/* <BodyBlocksTabs /> */}
//       <BodyBlocks />
//       {/* <Accordian /> */}
//       <Footer />
//       {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=G-D0SY7XGY0L"></Script>

//         <Script id="analytics-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
//                 function gtag(){
//                 dataLayer.push(arguments);
//                 }
//                 gtag('js', new Date());
//                 gtag('config', 'G-D0SY7XGY0L');`}}></Script> */}

//          </>
//   )
// }

// import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BodyMain from "../components/BodyMain";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
// import { useMediaQuery } from "@mui/material";
import BodyMain1 from "./BodyMain1";
import BodyMain2 from "./BodyMain2";
import ReviewsCarousel from "./ReviewsCard";
import BannerLandpage from "./BannerLandPage";
import PlatformComparison from "./PlatformComparison";

export default function LandingPage() {
  // const [cookieConsent, setCookieConsent] = useState(null);
  // const isMobile = useMediaQuery("(max-width:600px)");

  // useEffect(() => {
  //   if (cookieConsent === "accept") {
      // Initialize Google Analytics only if the user accepts cookies
  //     window.dataLayer = window.dataLayer || [];
  //     function gtag() {
  //       window.dataLayer.push(arguments);
  //     }
  //     gtag("js", new Date());
  //     gtag("config", "G-D1X0WBG5EL");
  //   }
  // }, [cookieConsent]);


  return (
    <>
      <Helmet>
        <title>Fastest Way to Switch Jobs | Direct Access to Top Tech Companies</title>
        <meta
          name="description"
          content="Switch to high-paying IT jobs faster with Newrole. Explore verified openings from trusted companies. No spam, no fake calls — just real tech career moves."
        />
        <meta
          property="og:title"
          content="Turn Audio into Stunning Videos | AudioReel"
        />
        <meta
          property="og:description"
          content="Switch to high-paying IT jobs faster with Newrole. Explore verified openings from trusted companies. No spam, no fake calls — just real tech career moves."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.newrole.in" />
       <meta name="google-site-verification" content="z3S3YuiRlbJVB_u7hB9OAhXaVifVn7bO5dzXyyHM-bc" />
      </Helmet>

      <Navbar />
      <BodyMain />
      <BodyMain1 />
      <PlatformComparison />
      <BodyMain2 />
      <ReviewsCarousel />
      <BannerLandpage />
      <Footer />

     
    </>
  );
}
