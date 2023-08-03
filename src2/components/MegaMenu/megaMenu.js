import React from 'react';
import { useNavigation } from '../../peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';
import { Link, resourceUrl } from 'src/drivers';
import defaultClasses from './megaMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';

const MegaMenu = () => {
    const talonsProps = useNavigation();
    const { mobileView } = useMobile();
    const navItems = [];

    const { navdetails } = talonsProps;
    if (typeof navdetails != 'undefined' && navdetails && !mobileView) {
        const elements = JSON.parse(navdetails).categories;
        if (elements) {
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
                                key={i + 'mainul'}
                                className={
                                    defaultClasses.sub_menu +
                                    ' ' +
                                    defaultClasses.lavel_1
                                }
                            >
                                {typeof v['sub_cats'] != 'undefined' &&
                                    v['sub_cats'].map((v1, i1) => {
                                        let showsubchild = true;
                                        let hasSubchild =
                                            defaultClasses.has_child;
                                        if (v1['sub_cats'].length) {
                                            showsubchild = true;
                                            hasSubchild =
                                                defaultClasses.has_child;
                                        } else {
                                            hasSubchild =
                                                defaultClasses.no_child;
                                            showsubchild = false;
                                        }
                                        return (
                                            <li
                                                key={i1 + 'sub'}
                                                className={hasSubchild}
                                            >
                                                <Link
                                                    to={resourceUrl(
                                                        '/' +
                                                            v1[
                                                                'sub_category_url'
                                                            ]
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
