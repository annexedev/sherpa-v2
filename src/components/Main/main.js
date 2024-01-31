import React, { useEffect, useState, Suspense, Component } from 'react';
import { bool, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Header from '../Header';
import defaultClasses from './main.css';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Iframe from 'react-iframe';
import JotformEmbed from 'react-jotform-embed';
import $ from 'jquery';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useCmsBlock } from '../../peregrine/lib/talons/Home/useHome';
import GET_CMSBLOCK_QUERY from '../../queries/getCmsBlocks.graphql';
import AccountTriggerResetPassword from '../Header/accountTriggerResetPassword';
/*

<div id="order" value="4"></div>
<div id="name" value="Scott Bond"></div>
<div id="title" value="Marketing Manager"></div>
<div id="email" value="sbond@sherpagroupav.com"></div>
<div id="phone" value="905-565-9028"></div>
<div id="extension" value="1152"></div>
<div id="linkedin" value="https://www.linkedin.com/in/scott-bond-8b9052a/"></div>
<div id="picture" value="/media/teamphotos/Scott2021-cropBW_EofQ2.jpg"></div>
<div id="bio" value="Though officially “in the business” for nearly a quarter century, Mr. Bond has been immersed in the A/V industry from the time he was learning to walk. His father worked at Bay Bloor Radio when he was just a babe, and Scott followed in dad’s footsteps, taking up marketing in college and joining the family AV distribution business which continued into the marketing department here at Sherpa. Whether learning new programming languages, whipping up marketing content, decking out his front yard for Halloween, or creating impressive 3D-printed movie replicas, Scott is the whirlwind of creation that keeps Sherpa Technology Group’s marketing efforts humming along!"></div>
<div id="cell" value=""></div>
<div id="region" value=""></div>

*/

class TriggerOpen extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }
    componentDidMount() {
        setTimeout(function() {
            document.getElementById('user_account').click();
        }, 1500);
    }
    render() {
        return <></>;
    }
}

class TriggerOpenResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }
    componentDidMount() {
        setTimeout(function() {
            document.getElementById('reset_password').click();
        }, 1500);
    }
    render() {
        return <></>;
    }
}

function ServiceDetailsEmployeurs(props) {
    let lng = '';
    if (document.getElementById('currentLng') != null) {
        lng = document.getElementById('currentLng').innerHTML;
    }
    let activeLng = '';
    if (lng == 'Français') {
        activeLng = '-fr';
    } else {
        activeLng = '';
    }

    const cmsBlockData = useCmsBlock({
        query: GET_CMSBLOCK_QUERY,
        identifier: 'team_' + props.id + activeLng,
        showBanner: true
    });

    const { cmsBlock } = cmsBlockData;
    let cmsBlockHtml = '';
    let name = '';
    let title = '';
    let email = '';
    let phone = '';
    let extension = '';
    let linkedin = '';
    let picture = '';
    let bio = '';
    let cell = '';
    let region = '';
    if (cmsBlock) {
        cmsBlockHtml = cmsBlock;
        let parser = new DOMParser();
        const doc = parser.parseFromString(cmsBlockHtml, 'text/html');
        name = doc.getElementById('name').getAttribute('value');
        title = doc.getElementById('title').getAttribute('value');
        email = doc.getElementById('email').getAttribute('value');
        phone = doc.getElementById('phone').getAttribute('value');
        extension = doc.getElementById('extension').getAttribute('value');
        linkedin = doc.getElementById('linkedin').getAttribute('value');
        picture = doc.getElementById('picture').getAttribute('value');
        bio = doc.getElementById('bio').getAttribute('value');
        cell = doc.getElementById('cell').getAttribute('value');
        region = doc.getElementById('region').getAttribute('value');
    }

    if (props.id % 2 == 0) {
        var customClass =
            'justify-content-center d-flex team-flex align-items-start align-items-lg-end justify-content-lg-end';
    } else {
        var customClass =
            'justify-content-center d-flex team-flex align-items-start justify-content-lg-start';
    }

    return (
        <>
            <div
                class="p-0 col-md-6 col-sm-12 team-item"
                id={'block-' + props.id}
            >
                <div className={customClass}>
                    <div class="p-0 col-lg-11">
                        <div id={'team-member-' + props.id}>
                            <Popup
                                trigger={
                                    <button className="button">
                                        <div class="image-anchor">
                                            <img
                                                class="zoom"
                                                src={picture}
                                                alt={name}
                                            />
                                            <span class="abs-plus-icon">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24.354"
                                                    height="24.451"
                                                    viewBox="0 0 24.354 24.451"
                                                >
                                                    <path
                                                        id="Tracé_60"
                                                        data-name="Tracé 60"
                                                        d="M13.313-37.95h4.929v9.761h9.713v4.929H18.241V-13.5H13.313V-23.26H3.6v-4.929h9.713Z"
                                                        transform="translate(-3.6 37.95)"
                                                        fill="#fff"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </button>
                                }
                                modal
                                nested
                            >
                                {close => (
                                    <div className="modal1">
                                        <button
                                            className="close"
                                            onClick={close}
                                        >
                                            &times;
                                        </button>
                                        <div className="content">
                                            {' '}
                                            <div
                                                id="modal-content-1"
                                                class="modal-content modal-slide"
                                                data-role="content"
                                            >
                                                <div
                                                    id="modal-team-member-1"
                                                    class="modal-team-member"
                                                >
                                                    <div class="modal-body-content">
                                                        <img
                                                            class="member-pic"
                                                            src={picture}
                                                        />
                                                        <div class="member-info-block">
                                                            <div class="member-name">
                                                                {name}
                                                            </div>
                                                            <div class="member-designation">
                                                                {title}
                                                            </div>
                                                            <div class="member-email">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14.083"
                                                                    height="9.75"
                                                                    viewBox="0 0 14.083 9.75"
                                                                >
                                                                    <g
                                                                        id="Icon_ionic-ios-mail"
                                                                        data-name="Icon ionic-ios-mail"
                                                                        transform="translate(0)"
                                                                    >
                                                                        <path
                                                                            id="Tracé_52"
                                                                            data-name="Tracé 52"
                                                                            d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z"
                                                                            transform="translate(-3.375 -9.14)"
                                                                            fill="#7ab13d"
                                                                        />
                                                                        <path
                                                                            id="Tracé_53"
                                                                            data-name="Tracé 53"
                                                                            d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z"
                                                                            transform="translate(-3.816 -7.875)"
                                                                            fill="#7ab13d"
                                                                        />
                                                                    </g>
                                                                </svg>
                                                                <a
                                                                    class="fill"
                                                                    href={
                                                                        'mailto:' +
                                                                        email
                                                                    }
                                                                >
                                                                    {email}
                                                                </a>
                                                            </div>
                                                            <div class="member-phone">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="10.818"
                                                                    height="10.817"
                                                                    viewBox="0 0 10.818 10.817"
                                                                >
                                                                    <path
                                                                        id="Icon_awesome-phone-alt"
                                                                        data-name="Icon awesome-phone-alt"
                                                                        d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z"
                                                                        transform="translate(0 0)"
                                                                        fill="#7ab13d"
                                                                    />
                                                                </svg>
                                                                <a
                                                                    class="fill"
                                                                    href={
                                                                        'tel:' +
                                                                        phone
                                                                    }
                                                                >
                                                                    {phone} Ext:{' '}
                                                                    {extension}
                                                                </a>
                                                            </div>
                                                            {cell != '' && (
                                                                <div class="member-phone">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="10.818"
                                                                        height="10.817"
                                                                        viewBox="0 0 10.818 10.817"
                                                                    >
                                                                        <path
                                                                            id="Icon_awesome-phone-alt"
                                                                            data-name="Icon awesome-phone-alt"
                                                                            d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z"
                                                                            transform="translate(0 0)"
                                                                            fill="#7ab13d"
                                                                        />
                                                                    </svg>
                                                                    <a
                                                                        class="fill"
                                                                        href={
                                                                            'tel:' +
                                                                            cell
                                                                        }
                                                                    >
                                                                        {cell}
                                                                    </a>
                                                                </div>
                                                            )}

                                                            <div class="member-about">
                                                                {bio}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popup>

                            <div class="contact-details">
                                <div class="grid-member-name">{name}</div>
                                <div class="grid-member-designation">
                                    {title}
                                </div>
                            </div>
                        </div>
                        <div class="contact-details">
                            <span class="email">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14.083"
                                    height="9.75"
                                    viewBox="0 0 14.083 9.75"
                                >
                                    <g
                                        id="Icon_ionic-ios-mail"
                                        data-name="Icon ionic-ios-mail"
                                        transform="translate(0)"
                                    >
                                        <path
                                            id="Tracé_52"
                                            data-name="Tracé 52"
                                            d="M17.343,10.335,13.7,14.045a.065.065,0,0,0,0,.095l2.549,2.715a.439.439,0,0,1,0,.623.441.441,0,0,1-.623,0l-2.539-2.7a.069.069,0,0,0-.1,0l-.62.63a2.726,2.726,0,0,1-1.943.819,2.78,2.78,0,0,1-1.984-.843l-.6-.606a.069.069,0,0,0-.1,0l-2.539,2.7a.441.441,0,0,1-.623,0,.439.439,0,0,1,0-.623L7.136,14.14a.072.072,0,0,0,0-.095L3.49,10.335a.067.067,0,0,0-.115.047v7.424a1.086,1.086,0,0,0,1.083,1.083H16.375a1.086,1.086,0,0,0,1.083-1.083V10.382A.068.068,0,0,0,17.343,10.335Z"
                                            transform="translate(-3.375 -9.14)"
                                            fill="#7ab13d"
                                        />
                                        <path
                                            id="Tracé_53"
                                            data-name="Tracé 53"
                                            d="M10.858,14.074a1.84,1.84,0,0,0,1.324-.555l5.312-5.406a1.064,1.064,0,0,0-.67-.237H4.9a1.057,1.057,0,0,0-.67.237l5.312,5.406A1.841,1.841,0,0,0,10.858,14.074Z"
                                            transform="translate(-3.816 -7.875)"
                                            fill="#7ab13d"
                                        />
                                    </g>
                                </svg>
                                <a class="fill" href={'mailto:' + email}>
                                    {email}
                                </a>
                            </span>
                            <br />
                            <span class="phone-number">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10.818"
                                    height="10.817"
                                    viewBox="0 0 10.818 10.817"
                                >
                                    <path
                                        id="Icon_awesome-phone-alt"
                                        data-name="Icon awesome-phone-alt"
                                        d="M10.509,7.644,8.143,6.63a.507.507,0,0,0-.592.146L6.5,8.056A7.831,7.831,0,0,1,2.759,4.313L4.04,3.265a.506.506,0,0,0,.146-.592L3.171.307A.51.51,0,0,0,2.59.013L.393.52A.507.507,0,0,0,0,1.014a9.8,9.8,0,0,0,9.8,9.8.507.507,0,0,0,.494-.393l.507-2.2a.513.513,0,0,0-.3-.583Z"
                                        transform="translate(0 0)"
                                        fill="#7ab13d"
                                    />
                                </svg>
                                <a class="fill" href={'tel:' + phone}>
                                    {phone} Ext: {extension}
                                </a>
                            </span>
                        </div>
                        <div class="linkedin">
                            <a href={linkedin} target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16.617"
                                    height="16.617"
                                    viewBox="0 0 16.617 16.617"
                                >
                                    <path
                                        id="Icon_awesome-linkedin"
                                        data-name="Icon awesome-linkedin"
                                        d="M15.43,2.25H1.183A1.192,1.192,0,0,0,0,3.448V17.669a1.192,1.192,0,0,0,1.183,1.2H15.43a1.2,1.2,0,0,0,1.187-1.2V3.448A1.2,1.2,0,0,0,15.43,2.25ZM5.022,16.493H2.559V8.563H5.026v7.93ZM3.791,7.48A1.428,1.428,0,1,1,5.219,6.052,1.429,1.429,0,0,1,3.791,7.48Zm10.464,9.013H11.792V12.636c0-.92-.019-2.1-1.28-2.1-1.283,0-1.48,1-1.48,2.036v3.924H6.569V8.563H8.932V9.646h.033A2.594,2.594,0,0,1,11.3,8.367c2.493,0,2.956,1.643,2.956,3.78Z"
                                        transform="translate(0 -2.25)"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

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
    const [{ isSignedIn }] = useUserContext();
    const Banner = React.lazy(() => import('/src/components/CedHome/banner'));
    const categoryBannerIdentifierHome = 'education_landing';
    let showCategoryBanners = true;

    var displayLogin = false;
    var displayRegister = false;
    var displayTeam = false;
    var displayEducation = false;
    var display12Days = false;
    var displayResetPassword = false;

    if (isSignedIn && window.location.href.indexOf('/events') != -1) {
        window.eventCalId = 13099;
        var integrationScript = document.createElement('script');
        integrationScript.async = 1;
        integrationScript.setAttribute(
            'src',
            'https://api.eventcalendarapp.com/integration-script.js'
        );
        document.head.appendChild(integrationScript);
    }

    if (window.location.href.indexOf('/myprojects') != -1) {
        window.location.replace('/wishlist');
    }

    if (window.location.href.indexOf('/education-landing') != -1) {
        displayEducation = false;
    }

    if (window.location.href.indexOf('/events') != -1) {
        displayLogin = false;
    }

    if (window.location.href.indexOf('/sherpa-webinar-archive') != -1) {
        displayLogin = true;
    }

    if (window.location.href.indexOf('/brand-youtube-links') != -1) {
        displayLogin = true;
    }

    if (window.location.href.indexOf('/new-user-account') != -1) {
        displayRegister = true;
    }

    if (window.location.href.indexOf('/sherpa-our-team') != -1) {
        displayTeam = true;
    }

    if (window.location.href.indexOf('/12-days-of-sherpa') != -1) {
        display12Days = true;
    }

    if (window.location.href.indexOf('/set-password') != -1) {
        displayResetPassword = true;
    }

    function openLoginBox() {
        document.getElementById('user_account').click();
    }

    let lng = '';
    if (document.getElementById('currentLng') != null) {
        lng = document.getElementById('currentLng').innerHTML;
    }
    let activeLng = '';
    if (lng == 'Français') {
        activeLng = '-fr';
    } else {
        activeLng = '';
    }
    let showOfferBanners = true;
    let teamtest = 'team_4';

    let team_extension = '';
    let team_image = '';

    return (
        <main className={rootClass}>
            <Header />
            <div className={pageClass}>
                {(() => {

                    if(displayResetPassword) {
                        return (
                            <div>
                            <TriggerOpenResetPassword />
                            <br />
                            <br />
                            <br />
                            <AccountTriggerResetPassword />
                        </div>
                        )
                    }

                    if(isSignedIn && display12Days) {
                        return (
                        <Suspense fallback={''}>
                            <Banner
                                identifier={'sherpa12dys'}
                                showBanner={showCategoryBanners}
                            />
                        </Suspense>
                        )
                    }

                    if(!isSignedIn && display12Days) {
                        return (
                        <>
                            <TriggerOpen />
                            <Suspense fallback={''}>
                                <Banner
                                    identifier={'12daysnot'}
                                    showBanner={showCategoryBanners}
                                />
                            </Suspense>
                        </>
                        )
                    }

                    /* if(isSignedIn && display12Days && activeLng == '') {
                        return (
                        <Suspense fallback={''}>
                            <Banner
                                identifier={'sherpa12dys'}
                                showBanner={showCategoryBanners}
                            />
                        </Suspense>
                        )
                    } */


                    if (displayTeam) {
                        //return(children)
                        return (
                            <>
                                <section class="team-page-section">
                                    <div class="container">
                                        <div class="row">
                                            <ServiceDetailsEmployeurs id="1" />
                                            <ServiceDetailsEmployeurs id="2" />
                                            <ServiceDetailsEmployeurs id="3" />
                                            <ServiceDetailsEmployeurs id="4" />
                                            <ServiceDetailsEmployeurs id="5" />
                                            <ServiceDetailsEmployeurs id="6" />
                                            <ServiceDetailsEmployeurs id="7" />
                                            <ServiceDetailsEmployeurs id="8" />
                                            <ServiceDetailsEmployeurs id="9" />
                                            <ServiceDetailsEmployeurs id="10" />
                                            <ServiceDetailsEmployeurs id="11" />
                                            <ServiceDetailsEmployeurs id="12" />
                                            <ServiceDetailsEmployeurs id="13" />
                                            <ServiceDetailsEmployeurs id="14" />
                                            <ServiceDetailsEmployeurs id="15" />
                                            <ServiceDetailsEmployeurs id="16" />
                                        </div>
                                    </div>
                                </section>
                            </>
                        );
                    }

                    if (!isSignedIn && displayLogin) {
                        return (
                            <div>
                                <TriggerOpen />
                                <br />
                                <br />
                                <br />
                                <a
                                    style={{ cursor: 'pointer' }}
                                    onClick={openLoginBox}
                                >
                                    Login or Register for an Account to view
                                    this page
                                </a>
                            </div>
                        );
                    } else if (!isSignedIn && displayRegister) {
                        if (activeLng == '-fr') {
                            return (
                                <JotformEmbed src="https://form.jotform.com/232267921078258" />
                            );
                        } else {
                            return (
                                <JotformEmbed src="https://form.jotform.com/230886199517066" />
                            );
                        }
                    } else if (!isSignedIn && displayEducation) {
                        return (
                            <Suspense fallback={''}>
                                <Banner
                                    identifier={categoryBannerIdentifierHome}
                                    showBanner={showCategoryBanners}
                                />
                            </Suspense>
                        );
                    } else {
                        return children;
                    }

                    return null;
                })()}

                {window.location.href.indexOf('/events') != -1 ? (
                    <div
                        class="eca-app-container"
                        data-widgetuuid="cbe1fe53-0fc4-4ece-9b1b-2f04e8372406"
                    />
                ) : (
                    ''
                )}

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
