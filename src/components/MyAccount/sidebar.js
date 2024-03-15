import React, { useState, useEffect, Component } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import defaultClasses from './myAccount.css';
import { Link } from 'src/drivers';
import AccountGreeting from './accountGreeting';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import wishlistClasses from './mywishlist.css';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';

class ProjectList extends Component {
    constructor() {
        super();
        this.state = {
            pageData: [],
            pageDataAccess: [],
            name: 'React Component reload sample',
            reload: false,
            myProjectsVisible: false,
            myArchiveVisible: false,
            showAll: false,
        };
    }

    componentDidMount() {
        let pid = this.props.pid;
        console.log(this.props);
        let dataURL =
            'https://data.sherpagroupav.com/get_projects.php?email=' + pid;
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });


        let grantAccess =
            'https://data.sherpagroupav.com/get_projectaccess.php?email=' + pid;
        fetch(grantAccess)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageDataAccess: res
                });
            });
    }


    /* ----- HIDE/SHOW ---------- */




    alternateVisibilityArchive = () => {
        this.setState((prevState) => ({
            myArchiveVisible: !prevState.myArchiveVisible,
        }));
    }

    alternateVisibilityProjects = () => {
        this.setState((prevState) => ({
            myProjectsVisible: !prevState.myProjectsVisible,
        }));
    }

    handleShowMoreClick = () => {
        this.setState({ showAll: true });
    }


    render() {
        let archive = this.props.archive;
        const { showAll } = this.state;

        // console.log(showAll);
        const classes = mergeClasses(defaultClasses, wishlistClasses);

        const queryParameters = new URLSearchParams(window.location.search);

        const projectId = queryParameters.get('id');

        const url = window.location.href;
        const purchasedPage = url.includes('/orders') && url.includes('project') ? true : false




        //console.log('Access ::::::: ');
        //console.log(this.state.pageDataAccess["access"]);

        const ProjectItems = props => {
            const { onClose } = props;
            let path = '';
            if (typeof props.activePath != 'undefined') {
                path = props.activePath;
            } else if (typeof props.history != 'undefined') {
                path = props.history.location.pathname;
            }

            if (this.state.pageDataAccess['access'] == 1) {
                return (
                    <>
                        {!this.props.archive ? (
                            <li
                                className={
                                    path == '/myprojects'
                                        ? defaultClasses.item +
                                        ' ' +
                                        defaultClasses.active
                                        : defaultClasses.item
                                }
                                onClick={this.alternateVisibilityProjects}
                            >
                                {' '}
                                <span
                                    className={
                                        defaultClasses.dashboard_links_images
                                    }
                                >
                                    <img
                                        src="/cenia-static/images/myprojects.png"
                                        alt="wishlist"
                                        width="20"
                                        height="20"
                                    />
                                </span>
                                <Link to="/myprojects" onClick={onClose}>
                                    <FormattedMessage
                                        id={'sidebar.MyWishlist'}
                                        defaultMessage={'MyProjects (active)'}
                                    />
                                </Link>
                            </li>
                        ) : (
                            <li
                                className={
                                    path == '/myprojects'
                                        ? defaultClasses.item +
                                        ' ' +
                                        defaultClasses.active
                                        : defaultClasses.item
                                }
                                onClick={this.alternateVisibilityArchive}
                            >
                                {' '}
                                <span
                                    className={
                                        defaultClasses.dashboard_links_images
                                    }
                                >
                                    <img
                                        src="/cenia-static/images/myprojects.png"
                                        alt="wishlist"
                                        width="20"
                                        height="20"
                                    />
                                </span>
                                <Link to="/myprojects" onClick={onClose}>
                                    <FormattedMessage
                                        id={'sidebar.MyWishlistArchive'}
                                        defaultMessage={'MyProjects Archives'}
                                    />
                                </Link>
                            </li>
                        )}
                        <ul className={defaultClasses.wrapperProjects}>

                            {this.state.pageData &&
                                this.state.pageData.map((e, index) => {
                                    // --------------- PROJECT ARCHIVES ------------
                                    // const produitsLength = e.category_id.length;
                                    // const tenPlus = {produitsLength > 10 'scroll' : 'hidden'};
                                    if (
                                        e.category_name.startsWith('ARCHIVE') &&
                                        this.props.archive &&
                                        projectId == e.category_id
                                    ) {
                                        return (
                                            <>
                                                {/* {this.state.myArchiveVisible && ( */}
                                                <li
                                                    className={
                                                        classes.projectlist +
                                                        ' ' +
                                                        classes.projectlistactive
                                                    }

                                                >
                                                    <a
                                                        href={
                                                            '/myprojects?id=' +
                                                            e.category_id + '&archive=1'
                                                        }
                                                    >
                                                        {e.category_name}
                                                    </a>
                                                </li>
                                                {/* )} */}
                                            </>
                                        );
                                    } else if (
                                        e.category_name.startsWith('ARCHIVE') &&
                                        this.props.archive
                                    ) {
                                        // bloc a faire le hide/show au click
                                        return (
                                            <>
                                                {this.state.myArchiveVisible && (

                                                    <li className={classes.projectlist}>
                                                        <a
                                                            href={
                                                                '/myprojects?id=' +
                                                                e.category_id + '&archive=1'
                                                            }
                                                        >
                                                            {e.category_name}
                                                        </a>
                                                    </li>
                                                )}
                                            </>

                                        );
                                    }
                                    // ------------ MY PROJECTS --------------

                                    const active = projectId == e.category_id ? true : false;
                                    if (
                                        !e.category_name.startsWith('ARCHIVE') &&
                                        !this.props.archive &&
                                        projectId == e.category_id && !purchasedPage
                                    ) {
                                        return (
                                            <>
                                                {/* {this.state.myProjectsVisible( */}
                                                <li
                                                    className={
                                                        classes.projectlist +
                                                        ' ' +
                                                        classes.projectlistactive
                                                    }
                                                >
                                                    <a
                                                        href={
                                                            '/myprojects?id=' +
                                                            e.category_id
                                                        }
                                                    >
                                                        {e.category_name}
                                                    </a>
                                                </li>
                                                {/* )} */}
                                            </>
                                        );
                                    } else if (
                                        !e.category_name.startsWith('ARCHIVE') &&
                                        !this.props.archive
                                    ) {
                                        /* ---- validation pour la page purchased mantenir le dropdown ouvert ------ */
                                        if (
                                            !e.category_name.startsWith('ARCHIVE') &&
                                            !this.props.archive && purchasedPage
                                        ) {
                                            // bloc a faire le hide/show au click
                                            return (
                                                <>
                                                    <li className={!active ? classes.projectlist : classes.projectlist + ' ' + classes.projectlistactive}>
                                                        <a
                                                            href={
                                                                '/myprojects?id=' +
                                                                e.category_id
                                                            }
                                                        >
                                                            {e.category_name}
                                                        </a>
                                                    </li>
                                                </>
                                            );
                                        } else {
                                            // bloc a faire le hide/show au click
                                            return (
                                                <>
                                                    {this.state.myProjectsVisible && (
                                                        <>
                                                            <li className={classes.projectlist}>
                                                                <a
                                                                    href={
                                                                        '/myprojects?id=' +
                                                                        e.category_id
                                                                    }
                                                                >
                                                                    {e.category_name}
                                                                </a>
                                                            </li>
                                                        </>
                                                    )}
                                                </>
                                            );
                                        }
                                    }
                                })
                            }
                        </ul>
                    </>
                );
            } else {
                return <></>;
            }
        };

        return (
            // <React.Fragment>
            <ProjectItems />
            // </React.Fragment>
        );
    }
}

const Sidebar = props => {
    const { onClose } = props;
    let path = '';
    if (typeof props.activePath != 'undefined') {
        path = props.activePath;
    } else if (typeof props.history != 'undefined') {
        path = props.history.location.pathname;
    }

    const { email } = useDashboard();


    return (
        <div className={defaultClasses.sideBar_wrapper}>
            <AccountGreeting />
            <ul className={defaultClasses.list}>
                <li
                    className={
                        path == '/account'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/account.png"
                            alt="account"
                            width="20"
                            height="20"
                        />
                    </span>
                    <Link to="/account" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.MyAccount'}
                            defaultMessage={'My Account'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/orders'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/sent.png"
                            width="20"
                            height="20"
                            alt="sent"
                        />
                    </span>
                    <Link to="/orders" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.MyOrders'}
                            defaultMessage={'My Orders'}
                        />
                    </Link>
                </li>

                {email ? (
                    <ProjectList pid={email} archive={false} />
                ) : (
                    <>
                        <p>Loading projects</p>
                    </>
                )}

                {email ? (
                    <ProjectList pid={email} archive={true} />
                ) : (
                    <>
                        <p>Loading archive projects</p>
                    </>
                )}
                <li
                    className={
                        path == '/addresses'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/home.png"
                            width="20"
                            height="20"
                            alt="home"
                        />
                    </span>
                    <Link to="/addresses" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.AddressBook'}
                            defaultMessage={'Address Book'}
                        />
                    </Link>
                </li>
                <li
                    className={
                        path == '/accountinformation'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/information.png"
                            width="20"
                            height="20"
                            alt="information"
                        />
                    </span>
                    <Link to="/profile" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar. AccountInformation'}
                            defaultMessage={'Account Information'}
                        />
                    </Link>
                </li>
                {/*<li
                    className={
                        path == '/reviews'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    {' '}
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/like.png"
                            width="20"
                            height="20"
                            alt="like"
                        />
                    </span>
                    <Link to="/reviews" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.Reviews'}
                            defaultMessage={'My Reviews & Ratings'}
                        />
                    </Link>
                </li> 
                <li
                    className={
                        path == '/newsletter'
                            ? defaultClasses.item + ' ' + defaultClasses.active
                            : defaultClasses.item
                    }
                >
                    <span className={defaultClasses.dashboard_links_images}>
                        <img
                            src="/cenia-static/images/email.png"
                            width="20"
                            height="20"
                            alt="email"
                        />
                    </span>
                    <Link to="/newsletter" onClick={onClose}>
                        <FormattedMessage
                            id={'sidebar.NewsletterSubscriptions'}
                            defaultMessage={'Newsletter Subscriptions'}
                        />
                    </Link>
                </li> */}
            </ul>
        </div>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
