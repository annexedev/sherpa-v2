import React from 'react';
import { useNavigation } from '../../peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';
import { Link, resourceUrl } from 'src/drivers';
import defaultClasses from './megaMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import { useUserContext } from '@magento/peregrine/lib/context/user';
    
function hideNav() {
   //document.getElementById("id-main").style.opacity = "0";
}

const MegaMenu = () => {
    const talonsProps = useNavigation();
    const { mobileView } = useMobile();
    const navItems = [];
    const [{ isSignedIn }] = useUserContext();
    const { navdetails } = talonsProps;
    if (typeof navdetails != 'undefined' && navdetails && !mobileView) {
        const elements = JSON.parse(navdetails).categories;

        if (elements) {

            console.log('Elements');
            console.log(elements);

            navItems.push(
               <>
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/about">About us</a>
                </li>
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/sherpa-our-team">Our team</a>
                </li>
                </>
            );

            

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
                                to={resourceUrl('/' + v['main_category_url'])}
                            >
                                {v['main_category_name']}
                                {haschild && (
                                    <FontAwesomeIcon icon={faChevronDown} />
                                )}
                            </Link>
                            <ul
                                id='id-main'
                                key={i + 'mainul'}
                                className={
                                    defaultClasses.sub_menu +
                                    ' ' +
                                    defaultClasses.lavel_1
                                }
                            >
                                {typeof v['sub_cats'] != 'undefined' &&
                                    v['sub_cats'].sort(function(a, b) {
                                        if(a.sub_category_name.toLowerCase() < b.sub_category_name.toLowerCase()) return -1;
                                        if(a.sub_category_name.toLowerCase() > b.sub_category_name.toLowerCase()) return 1;
                                        return 0;
                                       }).map((v1, i1) => {
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
                                                    onClick={() => {window.location.href="/"+v1['sub_category_url']}}
                                                    to={resourceUrl(
                                                        '/' + v1['sub_category_url']
                                                    )}
                                                >
                                                    {v1['sub_category_name']}
                                                    {showsubchild && (
                                                        <FontAwesomeIcon
                                                            icon={faChevronDown}
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
                                                                                    ]
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

            if(isSignedIn) {

            navItems.push(
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/promotions">Promotions</a>
                </li>
            );

            {/*navItems.push(
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/brands">Price lists</a>
                </li>
            ); */}

            navItems.push(
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/brands/clearance">Clearance</a>
                </li>
            );

            navItems.push(
                <li
                    
                    className={
                        defaultClasses.item +
                        ' ' +
                        defaultClasses.haschild
                    }
                >
                    <a href="/education-landing">Education<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></a>
                    <ul id="id-main" className={
                                    defaultClasses.sub_menu +
                                    ' ' +
                                    defaultClasses.lavel_1 + ' ' + defaultClasses.col1
                                }>
                        <li class="megaMenu-has_child-1b6"><a href="/events">Event Calendar</a></li>
                        <li class="megaMenu-has_child-1b6"><a href="/sherpa-webinar-archive">Webinar Archive</a></li>
                        <li class="megaMenu-has_child-1b6"><a href="/brand-youtube-links">Brand YouTube Pages</a></li>
                    </ul>
                </li>
            );

            } else {

                navItems.push(
                    <li
                        
                        className={
                            defaultClasses.item +
                            ' ' +
                            defaultClasses.haschild
                        }
                    >
                        <a href="/promotions">Promotions</a>
                    </li>
                );

                navItems.push(
                    <li
                        
                        className={
                            defaultClasses.item +
                            ' ' +
                            defaultClasses.haschild
                        }
                    >
                        <a href="/education-landing">Education</a>
                        
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
