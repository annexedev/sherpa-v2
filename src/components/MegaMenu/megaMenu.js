import React from 'react';
import { useNavigation } from '../../peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';
import { Link, resourceUrl } from 'src/drivers';
import defaultClasses from './megaMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

function hideNav() {
    //document.getElementById("id-main").style.opacity = "0";
}

const MegaMenu = () => {
    const talonsProps = useNavigation();
    const { mobileView } = useMobile();
    const navItems = [];
    const [{ isSignedIn }] = useUserContext();
    const { navdetails } = talonsProps;

    /* Get store view for language */

    const storage = new BrowserPersistence();
    function getStoreview() {
        var storeview = storage.getItem('store_view_code');
        if (!storeview) {
            storeview = '';
        } else {
            storeview = storeview;
        }
        return storeview;
    }

    var storeview = getStoreview();

    if (typeof navdetails != 'undefined' && navdetails && !mobileView) {

	if (window.location.href.indexOf("/default") > -1) {
            window.location.href = '/fr';
        }

        const elements = JSON.parse(navdetails).categories;

        if (elements) {

            if (isSignedIn) {

            navItems.push(
                <>
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        {storeview == 'fr' ? (
                            <>
                            <Link to={resourceUrl('/about')}>
                                À propos
                                <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="chevron-down"
                                        className="svg-inline--fa fa-chevron-down fa-w-14 "
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                                        />
                                    </svg>
                            </Link>
                            <ul
                                    id="id-main"
                                    className={
                                        defaultClasses.sub_menu +
                                        ' ' +
                                        defaultClasses.lavel_1 +
                                        ' ' +
                                        defaultClasses.col1
                                    }
                                >
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/fr/politique-expedition">
                                            Politique d'expédition
                                        </a>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <>
                            <Link to={resourceUrl('/about')}>
                                About us
                                <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="chevron-down"
                                        className="svg-inline--fa fa-chevron-down fa-w-14 "
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                                        />
                                    </svg>
                            </Link>
                            <ul
                                id="id-main"
                                className={
                                    defaultClasses.sub_menu +
                                    ' ' +
                                    defaultClasses.lavel_1 +
                                    ' ' +
                                    defaultClasses.col1
                                }
                            >
                                <li className="megaMenu-has_child-1b6">
                                    <a href="/en/shipping-policy">
                                        Shipping policy
                                    </a>
                                </li>
                            </ul>
                            </>
                        )}
                    </li>
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        {storeview == 'fr' ? (
                            <Link to={resourceUrl('/sherpa-our-team')}>
                                Notre équipe
                            </Link>
                        ) : (
                            <Link to={resourceUrl('/sherpa-our-team')}>
                                Our team
                            </Link>
                        )}
                    </li>
                </>
            );

            } else {

                navItems.push(
                    <> 
                        <li
                            className={
                                defaultClasses.item + ' ' + defaultClasses.haschild
                            }
                        >
                            {storeview == 'fr' ? (
                                <Link to={resourceUrl('/about')}>
                                    À propos
                                </Link>
                                
                            ) : (
                                <Link to={resourceUrl('/about')}>
                                    About us
                                </Link>
                            )}
                        </li>
                        <li
                            className={
                                defaultClasses.item + ' ' + defaultClasses.haschild
                            }
                        >
                            {storeview == 'fr' ? (
                                <Link to={resourceUrl('/sherpa-our-team')}>
                                    Notre équipe
                                </Link>
                            ) : (
                                <Link to={resourceUrl('/sherpa-our-team')}>
                                    Our team
                                </Link>
                            )}
                        </li>
                    </>
                );
    

            }

            $.each(elements, function(i, v) {
                if (v['main_category_id']) {
                    let haschild = '';
                    if (
                        typeof v['sub_cats'] != 'undefined' &&
                        v['sub_cats'].length
                    ) {
                        haschild = defaultClasses.has_child;
                    } else {
                        haschild = '';
                    }
                    navItems.push(
                        <li
                            key={i}
                            className={
                                defaultClasses.item +
                                ' ' +
                                defaultClasses.haschild
                            }
                        >
                            <Link
                                to={resourceUrl('/' + v['main_category_url'].replace("brands/", "brands-sherpa/"))}
                            >
                                {v['main_category_name']}
                                {haschild && (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Link>
                            <ul
                                id="id-main"
                                key={i + 'mainul'}
                                className={
                                    defaultClasses.sub_menu +
                                    ' ' +
                                    defaultClasses.lavel_1
                                }
                            >
                                {typeof v['sub_cats'] != 'undefined' &&
                                    v['sub_cats']
                                        .sort(function(a, b) {
                                            if (
                                                a.sub_category_name.toLowerCase() <
                                                b.sub_category_name.toLowerCase()
                                            )
                                                return -1;
                                            if (
                                                a.sub_category_name.toLowerCase() >
                                                b.sub_category_name.toLowerCase()
                                            )
                                                return 1;
                                            return 0;
                                        })
                                        .map((v1, i1) => {
                                            let showsubchild = true;
                                            let hasSubchild =
                                                defaultClasses.has_child;
                                            if (v1['sub_cats'].length) {
                                                showsubchild = false;
                                                hasSubchild =
                                                    defaultClasses.has_child;
                                            } else {
                                                hasSubchild =
                                                    defaultClasses.no_child;
                                                showsubchild = false;
                                            }
                                            return (
                                                <li
                                                    onClick={hideNav()}
                                                    key={i1 + 'sub'}
                                                    className={hasSubchild}
                                                >
                                                    <Link
                                                        onClick={() => {
                                                            window.location.href =
                                                                '/' +
                                                                v1[
                                                                    'sub_category_url'
                                                                ].replace("brands/", "brands-sherpa/");
                                                        }}
                                                        to={resourceUrl(
                                                            '/' +
                                                                v1[
                                                                    'sub_category_url'
                                                                ].replace("brands/", "brands-sherpa/")
                                                        )}
                                                    >
                                                        {
                                                            v1['sub_category_name']
                                                        }
                                                        {showsubchild && (
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faChevronDown
                                                                }
                                                            />
                                                        )}
                                                    </Link>
                                                    {showsubchild && (
                                                        <ul
                                                            className={
                                                                defaultClasses.sub_menu +
                                                                ' ' +
                                                                defaultClasses.lavel_2
                                                            }
                                                        >
                                                            {v1['sub_cats'].map(
                                                                (v2, i2) => {
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                i2 +
                                                                                'supersub'
                                                                            }
                                                                        >
                                                                            <Link
                                                                                to={resourceUrl(
                                                                                    '/' +
                                                                                        v2[
                                                                                            'category_url'
                                                                                        ].replace("brands/", "brands-sherpa/")
                                                                                )}
                                                                            >
                                                                                {
                                                                                    v2[
                                                                                        'category_name'
                                                                                    ]
                                                                                }
                                                                            </Link>
                                                                        </li>
                                                                    );
                                                                }
                                                            )}
                                                        </ul>
                                                    )}
                                                </li>
                                            );
                                        })}
                            </ul>
                        </li>
                    );
                }
            });

            if (isSignedIn) {
                navItems.push(
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        {storeview == 'fr' ? (
                            <Link to={resourceUrl('/promotions')}>
                                Promotions
                            </Link>
                        ) : (
                            <Link to={resourceUrl('/promotions')}>
                                Promotions
                            </Link>
                        )}
                    </li>
                );

                {
                    /*navItems.push(
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/brands">Price lists</a>
                </li>
            ); */
                }

                navItems.push(
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        {storeview == 'fr' ? (
                            <Link to={resourceUrl('/brands-sherpa/clearance')}>
                                Liquidation
                            </Link>
                        ) : (
                            <Link to={resourceUrl('/brands-sherpa/clearance')}>
                                Clearance
                            </Link>
                        )}
                    </li>
                );

                navItems.push(
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        {storeview == 'fr' ? (
                            <>
                                <a href="/education-landing">
                                    Éducation
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="chevron-down"
                                        className="svg-inline--fa fa-chevron-down fa-w-14 "
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                                        />
                                    </svg>
                                </a>
                                <ul
                                    id="id-main"
                                    className={
                                        defaultClasses.sub_menu +
                                        ' ' +
                                        defaultClasses.lavel_1 +
                                        ' ' +
                                        defaultClasses.col1
                                    }
                                >
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/events">
                                            Calendrier des événements
                                        </a>
                                    </li>
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/sherpa-webinar-archive">
                                            Archives - formations
                                        </a>
                                    </li>
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/brand-youtube-links">
                                            Page YouTube de nos marques
                                        </a>
                                    </li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <a href="/education-landing">
                                    Education
                                    <svg
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="chevron-down"
                                        className="svg-inline--fa fa-chevron-down fa-w-14 "
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
                                        />
                                    </svg>
                                </a>
                                <ul
                                    id="id-main"
                                    className={
                                        defaultClasses.sub_menu +
                                        ' ' +
                                        defaultClasses.lavel_1 +
                                        ' ' +
                                        defaultClasses.col1
                                    }
                                >
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/events">Event Calendar</a>
                                    </li>
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/sherpa-webinar-archive">
                                            Webinar Archive
                                        </a>
                                    </li>
                                    <li className="megaMenu-has_child-1b6">
                                        <a href="/brand-youtube-links">
                                            Brand YouTube Pages
                                        </a>
                                    </li>
                                </ul>
                            </>
                        )}
                    </li>
                );
            } else {
                navItems.push(
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        <a href="/promotions">Promotions</a>
                    </li>
                );

                navItems.push(
                    <li
                        className={
                            defaultClasses.item + ' ' + defaultClasses.haschild
                        }
                    >
                        {storeview == 'fr' ? (
                            <Link to={resourceUrl('/education-landing')}>
                                Éducation
                            </Link>
                            
                        ) : (
                            <Link to={resourceUrl('/education-landing')}>
                                Education
                            </Link>
                        )}
                    </li>
                );
            }
        }
    }
    return (
        <>
            {!mobileView && (
                <div className={defaultClasses.main_navigation}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <ul className={defaultClasses.ced_megamenu}>
                                    {navItems}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MegaMenu;
