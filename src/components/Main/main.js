import React, { useEffect, useState, Suspense } from 'react';
import { bool, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Header from '../Header';
import defaultClasses from './main.css';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Iframe from 'react-iframe'
import JotformEmbed from 'react-jotform-embed';
import $ from 'jquery';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const MobileLinks = React.lazy(() => import('./mobileLinks'));
const Footer = React.lazy(() => import('../Footer'));
const PushNotification = React.lazy(() => import('./pushNotification'));

const Main = props => {
    const [scrollFlag, setScrollFlag] = useState(false);

    const handleClick = () => {
        if (!scrollFlag) setScrollFlag(true);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleClick);
        return () => {
            document.removeEventListener('scroll', handleClick);
        };
    });
    const { children, isMasked, mobileView } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;
    const token = localStorage.getItem('notification-token');

    if (window.location.href.indexOf("/events") != -1) {
        window.eventCalId=13099;
        var integrationScript = document.createElement("script");
        integrationScript.async = 1;
        integrationScript.setAttribute("src", "https://api.eventcalendarapp.com/integration-script.js");
        document.head.appendChild(integrationScript);
    }

    const Banner = React.lazy(() => import('/src/components/CedHome/banner'));
    const categoryBannerIdentifierHome = 'education_landing';
    let showCategoryBanners = true;

    var displayLogin = false;
    var displayRegister = false;
    var displayTeam = false;
    var displayEducation = false;

    if(window.location.href.indexOf("/myprojects") != -1) {
        window.location.replace("/wishlist");
    }

    if(window.location.href.indexOf("/education-landing") != -1) {
        
        displayEducation = true;
    }

    if(window.location.href.indexOf("/events") != -1) {
        displayLogin = true;
    }

    if(window.location.href.indexOf("/sherpa-webinar-archive") != -1) {
        displayLogin = true;
    }

    if(window.location.href.indexOf("/brand-youtube-links") != -1) {
        displayLogin = true;
    }

    if(window.location.href.indexOf("/new-user-account") != -1) {
        displayRegister = true;
    }

    if(window.location.href.indexOf("/sherpa-our-team") != -1) {
        displayTeam = true;
    }

    function openLoginBox() {
        document.getElementById('user_account').click();
    }  

    const [{ isSignedIn }] = useUserContext();

    return (
        <main className={rootClass}>
            <Header />
            <div className={pageClass}>
            
            {(() => {

              if(displayTeam){
                //return(children)
                return (
                    <>

<section class="team-page-section">
   <div class="container">
      <div class="row">
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-1">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-1">
                  <Popup
                        trigger={<button className="button">
                             <div class="image-anchor">
                                <img class="zoom" src="/media/teamphotos/phil2021-cropBW.jpg" alt="Philippe Rayes"/>
                                <span class="abs-plus-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                                    <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                                </svg>
                                </span>
                            </div>
                        </button>}
                        modal
                        nested
                    >
                        {close => (
                        <div className="modal1">
                            
                            <button className="close" onClick={close}>
                            &times;
                            </button>
                            <div className="content">
                                {' '}
                                <div id="modal-content-1" class="modal-content modal-slide" data-role="content">
                                    <div id="modal-team-member-1" class="modal-team-member">
                                    <div class="modal-body-content">
                                        <img class="member-pic" src="/media/teamphotos/phil2021-cropBW.jpg"/>
                                        <div class="member-info-block">
                                            <div class="member-name">Philippe Rayes</div>
                                            <div class="member-designation">President &amp; CEO</div>
                                            <div class="member-email">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                                                <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                                                    <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                                                    <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                                                </g>
                                                </svg>
                                                <a class="fill" href="mailto:prayes@sherpagroupav.com">prayes@sherpagroupav.com</a>
                                            </div>
                                            <div class="member-phone">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                                                <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                                                </svg>
                                                <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1102</a>
                                            </div>
                                            <div class="member-phone">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                                                <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                                                </svg>
                                                <a class="fill" href="tel:438-833-9739">438-833-9739</a>
                                            </div>
                                            <div class="member-about">With more than 20 years in the industry, building Sherpa Technology Group from the ground-up has been the fulfilment of a childhood dream of running a successful business. His first savings as a men’s clothing salesperson was spent on a sound system that was nothing short of foreshadowing at its finest. When not hard at work on Sherpa’s next win, you can find Phil enjoying the tranquility and productivity of the early morning hours with a hot coffee. Eventually you’ll find him driving through the European countryside, looking back at the great relationships made, accomplishments realized, and milestones achieved.</div>
                                            
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        )}
                    </Popup>
                    
                     <div class="contact-details">
                        <div class="grid-member-name">Philippe Rayes</div>
                        <div class="grid-member-designation">President &amp; CEO</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:prayes@sherpagroupav.com">prayes@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1102</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/philippe-rayes-153290b/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-2">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-2">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/claudia2021-cropBW.jpg" alt="Claudia Pizzi"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Claudia Pizzi</div>
                        <div class="grid-member-designation">Vice-President, Managing Partner</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:cpizzi@sherpagroupav.com">cpizzi@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1105</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/claudia-pizzi-54097129/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-3">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-3">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/robert-schnaar-profile_teampage_bw.jpg" alt="Robert Schnaar"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Robert Schnaar</div>
                        <div class="grid-member-designation">Director of Brand Development</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:rschnaar@sherpagroupav.com">rschnaar@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1112</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/robert-schnaar" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-4">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-4">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Scott2021-cropBW.jpg" alt="Scott Bond" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Scott Bond</div>
                        <div class="grid-member-designation">Marketing Manager</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:sbond@sherpagroupav.com">sbond@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:905-565-9028">905-565-9028 Ext: 1152</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/scott-bond-8b9052a/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-5">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-5">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Kyle_update-2023-gr.jpg" alt="Kyle Roussel" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Kyle Roussel</div>
                        <div class="grid-member-designation">Marketing Specialist</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:kroussel@sherpagroupav.com">kroussel@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1107</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/kyleroussel/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-6">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-6">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Mike2021-cropBW.jpg" alt="Mike Pham" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Mike Pham</div>
                        <div class="grid-member-designation">Business Development Manager</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:mpham@sherpagroupav.com">mpham@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:905-565-9028">905-565-9028 Ext: 1156</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:416-727-4052">416-727-4052</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/mike-pham-a297ba56/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-7">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-7">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/ScottD_profile1_bw_crop.jpg" alt="Scott Donaldson" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Scott Donaldson</div>
                        <div class="grid-member-designation">Business Development Manager</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:sdonaldson@sherpagroupav.com">sdonaldson@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:905-565-9028">905-565-9028 Ext: 1155</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:416-565-8949">416-565-8949</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/scott-donaldson-b0001023/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-8">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-8">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Drew2021-cropBW.jpg" alt="Drew Vergil-Bisaillon" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Drew Vergil-Bisaillon</div>
                        <div class="grid-member-designation">Business Development Manager<br/>Audio Category Manager</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:drew@sherpagroupav.com">drew@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:905-565-9028">905-565-9028 Ext: 1103</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-993-7081">514-993-7081</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/drew-vergil-bisaillon-1a5bba94/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-9">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-9">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/shayne2021-cropBW.jpg" alt="Shayne Walker" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Shayne Walker</div>
                        <div class="grid-member-designation">Technical Sales &amp; Systems Design Manager<br/>CI Category Manager</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:swalker@sherpagroupav.com">swalker@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1106</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-260-6440">514-260-6440</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/shayne-walker-3b185616/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-10">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-10">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Chuck_profile1_bw_crop.jpg" alt="Chuck Jackson" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Chuck Jackson</div>
                        <div class="grid-member-designation">Business Development Executive</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:cjackson@sherpagroupav.com">cjackson@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1109</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:438-833-9739">438-833-9739</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/chuck-jackson-b01a2677/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-11">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-11">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Derek2021-cropBW.jpg" alt="Derek Crossley" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Derek Crossley</div>
                        <div class="grid-member-designation">Logistics &amp; Operations Manager</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:dcrossley@sherpagroupav.com">dcrossley@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1101</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/derek-crossley-7904663a/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-12">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-12">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Rob_update-2023-gr2.jpg" alt="Rob Banchon" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Rob Banchon</div>
                        <div class="grid-member-designation">Sales &amp; Operations Coordinator - Mississauga</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:rbanchon@sherpagroupav.com">rbanchon@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:905-565-9028">905-565-9028 Ext: 1157</a>
                     </span>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-13">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-13">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Sabrina2021-cropBW.jpg" alt="Sabrina St-Pierre" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Sabrina St-Pierre</div>
                        <div class="grid-member-designation">Warehouse &amp; Operations Associate</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:sabrina@sherpagroupav.com">sabrina@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1111</a>
                     </span>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-14">
            <div class="justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end">
               <div class="p-0 col-lg-11">
                  <div id="team-member-14">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Robin2021-cropBW.jpg" alt="Robin Rolleri" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Robin Rolleri</div>
                        <div class="grid-member-designation">Administration &amp; Operations Coordinator</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:rrolleri@sherpagroupav.com">rrolleri@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1108</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/robin-rolleri-63a6a6a0/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div class="p-0 col-md-6 col-sm-12 team-item" id="block-15">
            <div class="justify-content-center d-flex team-flex align-items-start justify-content-lg-start">
               <div class="p-0 col-lg-11">
                  <div id="team-member-15">
                     <div class="image-anchor">
                        <img class="zoom" src="/media/teamphotos/Marc_profile_bw_crop.jpg" alt="Mark Simpson" loading="lazy"/>
                        <span class="abs-plus-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24.354" height="24.451" viewBox="0 0 24.354 24.451">
                              <path id="Tracé_60" data-name="Tracé 60" d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z" transform="translate(-3.6 37.95)" fill="#fff"></path>
                           </svg>
                        </span>
                     </div>
                     <div class="contact-details">
                        <div class="grid-member-name">Mark Simpson</div>
                        <div class="grid-member-designation">Operations &amp; Logistics Associate</div>
                     </div>
                  </div>
                  <div class="contact-details">
                     <span class="email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14.083" height="9.75" viewBox="0 0 14.083 9.75">
                           <g id="Icon_ionic-ios-mail" data-name="Icon ionic-ios-mail" transform="translate(0)">
                              <path id="Tracé_52" data-name="Tracé 52" d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z" transform="translate(-3.375 -9.14)" fill="#7ab13d"></path>
                              <path id="Tracé_53" data-name="Tracé 53" d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z" transform="translate(-3.816 -7.875)" fill="#7ab13d"></path>
                           </g>
                        </svg>
                        <a class="fill" href="mailto:msimpson@sherpagroupav.com">msimpson@sherpagroupav.com</a>
                     </span>
                     <br/>
                     <span class="phone-number">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10.818" height="10.817" viewBox="0 0 10.818 10.817">
                           <path id="Icon_awesome-phone-alt" data-name="Icon awesome-phone-alt" d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z" transform="translate(0 0)" fill="#7ab13d"></path>
                        </svg>
                        <a class="fill" href="tel:514-366-9822">514-366-9822 Ext: 1110</a>
                     </span>
                  </div>
                  <div class="linkedin">
                     <a href="https://www.linkedin.com/in/mark-simpson-21473173/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.617" height="16.617" viewBox="0 0 16.617 16.617">
                           <path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z" transform="translate(0 -2.25)"></path>
                        </svg>
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</section>
                    
                    


                    </>
                    
                )
              }

              if (!isSignedIn && displayLogin){
                  return (
                    <div>
                    <br/><br/><br/>
                    <a style={{cursor:'pointer'}} onClick={openLoginBox}>Login or Register for an Account to view this page</a>
                    </div>
                  )
              } else if (!isSignedIn && displayRegister) {
                return(
                    <JotformEmbed src="https://form.jotform.com/230886199517066" />
                )

              } else if (!isSignedIn && displayEducation) {
                return(
                    <Suspense fallback={''}>
                        <Banner
                            identifier={categoryBannerIdentifierHome}
                            showBanner={showCategoryBanners}
                        />
                    </Suspense>
                )

              } else {
                return(children)
              }
              
              return null;
            })()}    
            
            {window.location.href.indexOf("/events") != -1 ?
                 <div class="eca-app-container" data-widgetuuid="cbe1fe53-0fc4-4ece-9b1b-2f04e8372406"></div>
            : ''}
            
                
                {/* bottom_toolbar */}
                {mobileView && (
                    <React.Suspense fallback={null}>
                        <MobileLinks />
                    </React.Suspense>
                )}
            </div>
            {scrollFlag && (
                <React.Suspense fallback={null}>
                    <Footer />
                </React.Suspense>
            )}
            {!token && scrollFlag && (
                <React.Suspense fallback={null}>
                    <PushNotification />
                </React.Suspense>
            )}
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool
};
