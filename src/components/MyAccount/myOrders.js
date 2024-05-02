import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import defaultClasses from './myAccount.css';
import searchClasses from '../SearchPage/searchPage.css';
import Sidebar from './sidebar.js';
import { useCustomerOrder } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { FormattedMessage } from 'react-intl';
import CustomerOrder from '../../queries/getCustomerOrderList.graphql';
import { Link, Redirect, resourceUrl } from 'src/drivers';
import MyOrderSkelton from './MyOrderSkeleton.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@magento/venia-ui/lib/components/Head';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { Price } from '@magento/peregrine';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';



const MyOrders = props => {
    const orderProps = useCustomerOrder({
        query: CustomerOrder,
        current_page: 1,
        limit: 5
    });
    const { data, isSignedIn, loading, loadMore } = orderProps;

    const loadMoreOrder = async () => {
        if (typeof data != 'undefined') {
            loadMore({
                current_page: data.current_page + 1,
                limit: data.limit
            });
        }
    };

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    const { email } = useDashboard();

    class OrderPo extends Component {
        constructor() {
            super();
            this.state = {
                pageData: []
            };
        }

        componentDidMount() {
            let orderNumber = this.props.pid;
            let dataURL =
                'https://data.sherpagroupav.com/get_pocomments.php?pid=' + orderNumber;

            fetch(dataURL)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        pageData: res
                    });
                });
        }

        render() {
            let orderpo = this.state.pageData.orderpo && this.state.pageData.orderpo;
            return (
                <React.Fragment>
                    <b>{orderpo}</b>
                </React.Fragment>
            );
        }
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const isProject = urlParams.get('project');
    const isId = urlParams.get('id');
    //console.log('doudou'+isProject);


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

    console.log(storeview);

    if (!loading && isProject == null) {
        return (
            <div className={defaultClasses.columns}>
                <Title>{`My Orders - ${STORE_NAME}`}</Title>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div
                                className={
                                    defaultClasses.column +
                                    ' ' +
                                    defaultClasses.main
                                }
                            >
                                <div className={defaultClasses.account_sideBar}>
                                    <Sidebar history={props.history} />
                                </div>
                                <div
                                    className={
                                        defaultClasses.account_contentBar
                                    }
                                >
                                    <div
                                        className={
                                            defaultClasses.page_title_wrapper
                                        }
                                    >
                                        <h1
                                            className={
                                                defaultClasses.page_title
                                            }
                                        >
                                            <span
                                                className={defaultClasses.base}
                                            >
                                                <FormattedMessage
                                                    id={'myOrders.page_title'}
                                                    defaultMessage={'My Orders'}
                                                />
                                            </span>
                                        </h1>
                                    </div>
                                    <div
                                        className={
                                            defaultClasses.block +
                                            ' ' +
                                            defaultClasses.block_dashboard_orders
                                        }
                                    >
                                        <div
                                            className={
                                                defaultClasses.recent_order_list
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.table_wrapper +
                                                    ' ' +
                                                    defaultClasses.orders_recent
                                                }
                                            >
                                                {typeof data != 'undefined' &&
                                                    data.items.length != 0 && (
                                                        <div
                                                            className={
                                                                defaultClasses.table_wrapper_inner
                                                            }
                                                        >
                                                            <ul
                                                                className={
                                                                    defaultClasses.table_wrapper_head
                                                                }
                                                            >
                                                                <li
                                                                    className={
                                                                        defaultClasses.item +
                                                                        ' ' +
                                                                        defaultClasses.head_item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'myOrders.Order'
                                                                        }
                                                                        defaultMessage={
                                                                            'Order #'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.item +
                                                                        ' ' +
                                                                        defaultClasses.head_item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'myOrders.Date'
                                                                        }
                                                                        defaultMessage={
                                                                            'Date'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.item +
                                                                        ' ' +
                                                                        defaultClasses.head_item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'myOrders.ShipTo'
                                                                        }
                                                                        defaultMessage={
                                                                            'Ship To'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.item +
                                                                        ' ' +
                                                                        defaultClasses.head_item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'myOrders.OrderTotal'
                                                                        }
                                                                        defaultMessage={
                                                                            'Order Total'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.item +
                                                                        ' ' +
                                                                        defaultClasses.head_item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'myOrders.Status'
                                                                        }
                                                                        defaultMessage={
                                                                            'Status'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.item +
                                                                        ' ' +
                                                                        defaultClasses.head_item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'myOrders.Action'
                                                                        }
                                                                        defaultMessage={
                                                                            'P.O.'
                                                                        }
                                                                    />
                                                                </li>
                                                            </ul>
                                                            <div
                                                                className={
                                                                    defaultClasses.table_wrapper_body
                                                                }
                                                            >
                                                                {data.items.map(
                                                                    (
                                                                        val,
                                                                        index
                                                                    ) => {
                                                                        console.log(val.status);
                                                                        return (
                                                                            <ul
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className={
                                                                                    defaultClasses.orders_row
                                                                                }
                                                                            >
                                                                                <li
                                                                                    mobilelabel="Order #"
                                                                                    className={
                                                                                        defaultClasses.item +
                                                                                        ' ' +
                                                                                        defaultClasses.body_item
                                                                                    }
                                                                                >

                                                                                    <Link
                                                                                        className={
                                                                                            defaultClasses.body_item_link +
                                                                                            ' ' +
                                                                                            defaultClasses.order_view_linkq
                                                                                        }
                                                                                        to={
                                                                                            '/orderview/' +
                                                                                            val.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            val.increment_id
                                                                                        }
                                                                                    </Link>


                                                                                </li>
                                                                                <li
                                                                                    mobilelabel="Date"
                                                                                    className={
                                                                                        defaultClasses.item +
                                                                                        ' ' +
                                                                                        defaultClasses.body_item
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        val.created_at.slice(0, -3)
                                                                                    }
                                                                                </li>
                                                                                <li
                                                                                    mobilelabel="Ship To"
                                                                                    className={
                                                                                        defaultClasses.item +
                                                                                        ' ' +
                                                                                        defaultClasses.body_item
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        val.ship_to
                                                                                    }
                                                                                </li>
                                                                                <li
                                                                                    mobilelabel="Order Total"
                                                                                    className={
                                                                                        defaultClasses.item +
                                                                                        ' ' +
                                                                                        defaultClasses.body_item
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        val.grand_total
                                                                                    }
                                                                                </li>
                                                                                <li
                                                                                    mobilelabel="Status"
                                                                                    className={
                                                                                        defaultClasses.item +
                                                                                        ' ' +
                                                                                        defaultClasses.body_item
                                                                                    }
                                                                                >
                                                                                    {storeview === 'fr' && val.status === 'Pending' || val.status === 'pending' ? 'En attente' : val.status === 'Processing' || val.status === 'processing' ? 'En traitement' : val.status === 'Complete'  || val.status === 'complete' ? 'Complétée' : val.status === 'Canceled' || val.status === 'canceled' ? 'Annulée' : val.status === 'New' || val.status === 'new' ? 'Nouveau' : val.status === 'Closed' || val.status === 'closed' ? 'Fermée' : val.status}                                                                                    
                                                                                </li>
                                                                                <li
                                                                                    mobilelabel="Action"
                                                                                    className={
                                                                                        defaultClasses.item +
                                                                                        ' ' +
                                                                                        defaultClasses.body_item
                                                                                    }
                                                                                >

                                                                                    <OrderPo pid={val.increment_id} />

                                                                                    {/*<Link
                                                                                        className={
                                                                                            defaultClasses.body_item_link +
                                                                                            ' ' +
                                                                                            defaultClasses.order_view_linkq
                                                                                        }
                                                                                        to={
                                                                                            '/orderview/' +
                                                                                            val.id
                                                                                        }
                                                                                    >
                                                                                        <FormattedMessage
                                                                                            id={
                                                                                                'myOrders.ViewOrder'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'View Order'
                                                                                            }
                                                                                        />
                                                                                        </Link> */}
                                                                                    {/* <a
                                                                                className={
                                                                                    defaultClasses.body_item_link
                                                                                }
                                                                                href="/"
                                                                            >
                                                                                Reorder
                                                                            </a> */}
                                                                                </li>
                                                                            </ul>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                {typeof data != 'undefined' &&
                                                    data.items.length > 0 &&
                                                    data.items.length <
                                                    data.total_count *
                                                    data.limit && (
                                                        <button
                                                            className={
                                                                defaultClasses.load_more_btn
                                                            }
                                                            onClick={
                                                                loadMoreOrder
                                                            }
                                                        >
                                                            <FormattedMessage
                                                                id={
                                                                    'global.loadMore'
                                                                }
                                                                defaultMessage={
                                                                    'Load More'
                                                                }
                                                            />
                                                        </button>
                                                    )}
                                                {data &&
                                                    data.items.length == 0 && (
                                                        <div
                                                            className={
                                                                searchClasses.noResult
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    searchClasses.noResult_icon
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faExclamationTriangle
                                                                    }
                                                                />
                                                            </span>
                                                            <span
                                                                className={
                                                                    'ml-2' +
                                                                    ' ' +
                                                                    searchClasses.noResult_text
                                                                }
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'myOrders.noOrderMessage'
                                                                    }
                                                                    defaultMessage={
                                                                        'You have no orders.'
                                                                    }
                                                                />
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (!loading && isProject != '') {

        class OrderLines extends Component {
            constructor() {
                super();
                this.state = {
                    pageData: []
                };
            }

            componentDidMount() {
                let orderNumber = this.props.orderNumber;
                let category_id = this.props.category_id;
                let dataURL =
                    'https://data.sherpagroupav.com/get_order_projects_lines.php?category_id=' + category_id + '&orderId=' + orderNumber;

                fetch(dataURL)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({
                            pageData: res
                        });
                    });
            }

            render() {

                let productReference = this.props.productReference;
                let orderId = this.props.orderId;

                return (
                    <React.Fragment>

                        {this.state.pageData && this.state.pageData.map(e => {

                            /*if(this.state.pageData && this.state.pageData.length < 1) {
                                document.getElementById(orderId).style.display='none';
                            }
                                
                            else */

                            if (productReference != '') {
                                console.log(e);

                                if (productReference == e.sku) {
                                    return (

                                        <p className={defaultClasses.stripe}>{parseInt(e.qty_invoiced)} x {e.name}</p>

                                    );
                                } else {
                                    return (

                                        // <p>{parseInt(e.qty_invoiced)} x {e.name}</p>
                                        <p>{e.sku}</p>


                                    );
                                }

                            } else {
                                return (

                                    <p>{parseInt(e.qty_invoiced)} x {e.name}</p>
                                    // <p>{e.sku}</p>

                                );
                            }




                        }
                        )}
                    </React.Fragment>
                );
            }
        }

        class ProjectName extends Component {
            constructor() {
                super();
                this.state = {
                    pageData: []
                };
            }

            componentDidMount() {
                let cid = this.props.cid;
                let dataURL =
                    'https://data.sherpagroupav.com/get_projectname.php?cid=' + cid;
                fetch(dataURL)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({
                            pageData: res
                        });
                    });
            }

            render() {
                let projectname = this.state.pageData.pname && this.state.pageData.pname;
                if (this.state.pageData.pname && this.state.pageData.pname) {
                    return (
                        <span className={defaultClasses.base}>
                            {/* {`Products found in this Project - ${projectname}`}  */}
                            <FormattedMessage
                                id={'myOrders.purchasedTitle'}
                                defaultMessage={'Products linked to this Project - '}
                            />
                            <span className={defaultClasses.nomProject}>{projectname}</span>
                        </span>
                    );
                } else {
                    return (<></>);
                }
            }
        }

        class FromProject extends Component {
            constructor() {
                super();
                this.state = {
                    pageData: []
                };
            }

            componentDidMount() {
                let email = this.props.email;
                let category_id = this.props.category_id;
                let dataURL =
                    'https://data.sherpagroupav.com/get_order_projects.php?category_id=' + category_id + '&email=' + email;

                fetch(dataURL)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({
                            pageData: res
                        });
                    });
            }

            render() {
                return (
                    <div className={defaultClasses.columns}>

                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div
                                        className={
                                            defaultClasses.column +
                                            ' ' +
                                            defaultClasses.main
                                        }
                                    >
                                        <div className={defaultClasses.account_sideBar}>
                                            <Sidebar history={props.history} />
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.account_contentBar
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.page_title_wrapper
                                                }
                                            >
                                                <h1
                                                    className={
                                                        defaultClasses.page_title
                                                    }
                                                >
                                                    <span
                                                        className={defaultClasses.base}
                                                    >
                                                        <ProjectName cid={isProject} />
                                                    </span>
                                                </h1>
                                            </div>
                                            <div
                                                className={
                                                    defaultClasses.block +
                                                    ' ' +
                                                    defaultClasses.block_dashboard_orders
                                                }
                                            >
                                                <div
                                                    className={
                                                        defaultClasses.recent_order_list
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            defaultClasses.table_wrapper +
                                                            ' ' +
                                                            defaultClasses.orders_recent
                                                        }
                                                    >
                                                        {typeof data != 'undefined' &&
                                                            data.items.length != 0 && (
                                                                <div
                                                                    className={
                                                                        defaultClasses.table_wrapper_inner
                                                                    }
                                                                >
                                                                    <ul
                                                                        className={
                                                                            defaultClasses.table_wrapper_head
                                                                        }
                                                                    >
                                                                        {/* Order */}
                                                                        <li
                                                                            className={
                                                                                defaultClasses.item +
                                                                                ' ' +
                                                                                defaultClasses.head_item
                                                                            }
                                                                        >
                                                                            <FormattedMessage
                                                                                id={
                                                                                    'myOrders.Order'
                                                                                }
                                                                                defaultMessage={
                                                                                    'Order #'
                                                                                }
                                                                            />
                                                                        </li>
                                                                        {/* Date */}
                                                                        <li
                                                                            className={
                                                                                defaultClasses.item +
                                                                                ' ' +
                                                                                defaultClasses.head_item
                                                                            }
                                                                        >
                                                                            <FormattedMessage
                                                                                id={
                                                                                    'myOrders.Date'
                                                                                }
                                                                                defaultMessage={
                                                                                    'Date'
                                                                                }
                                                                            />
                                                                        </li>
                                                                        {/* Order total */}
                                                                        <li
                                                                            className={
                                                                                defaultClasses.item +
                                                                                ' ' +
                                                                                defaultClasses.head_item
                                                                            }
                                                                        >
                                                                            <FormattedMessage
                                                                                id={
                                                                                    'myOrders.OrderTotal'
                                                                                }
                                                                                defaultMessage={
                                                                                    'Order Total'
                                                                                }
                                                                            />
                                                                        </li>
                                                                        {/* Status */}
                                                                        <li
                                                                            className={
                                                                                defaultClasses.item +
                                                                                ' ' +
                                                                                defaultClasses.head_item
                                                                            }
                                                                        >
                                                                            <FormattedMessage
                                                                                id={
                                                                                    'myOrders.Status'
                                                                                }
                                                                                defaultMessage={
                                                                                    'Status'
                                                                                }
                                                                            />
                                                                        </li>
                                                                        {/* Product Linked */}
                                                                        <li
                                                                            className={
                                                                                defaultClasses.item +
                                                                                ' ' +
                                                                                defaultClasses.head_item
                                                                            }
                                                                        >
                                                                            <FormattedMessage
                                                                                id={
                                                                                    'myOrders.ProductsLinked'
                                                                                }
                                                                                defaultMessage={
                                                                                    'Products linked to this project'
                                                                                }
                                                                            />

                                                                        </li>
                                                                    </ul>
                                                                    <div
                                                                        className={
                                                                            defaultClasses.table_wrapper_body
                                                                        }
                                                                    >

                                                                        {this.state.pageData && this.state.pageData.map(e => {
console.log(e.status);
                                                                            return (
                                                                                <ul
                                                                                    className={
                                                                                        defaultClasses.orders_row
                                                                                    }

                                                                                    id={e.order_id}
                                                                                >
                                                                                    {/* order */}
                                                                                    <li
                                                                                        mobilelabel="Order #"
                                                                                        className={
                                                                                            defaultClasses.item +
                                                                                            ' ' +
                                                                                            defaultClasses.body_item
                                                                                        }
                                                                                    >

                                                                                        <Link
                                                                                            className={
                                                                                                defaultClasses.body_item_link +
                                                                                                ' ' +
                                                                                                defaultClasses.order_view_linkq
                                                                                            }
                                                                                            to={
                                                                                                '/orderview/' +
                                                                                                e.order_id
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                e.increment_id
                                                                                            }
                                                                                        </Link>


                                                                                    </li>
                                                                                    {/* Date */}
                                                                                    <li
                                                                                        mobilelabel="Date"
                                                                                        className={
                                                                                            defaultClasses.item +
                                                                                            ' ' +
                                                                                            defaultClasses.body_item
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            e.created_at.slice(0, -3)
                                                                                        }
                                                                                    </li>
                                                                                    {/* Order total */}
                                                                                    <li
                                                                                        mobilelabel="Order Total"
                                                                                        className={
                                                                                            defaultClasses.item +
                                                                                            ' ' +
                                                                                            defaultClasses.body_item
                                                                                        }
                                                                                    >
                                                                                        {/* {
                                                                                            e.grand_total
                                                                                        } $ */}
                                                                                        <Price value={e.grand_total} currencyCode={'CAD'} />
                                                                                    </li>
                                                                                    {/* Status */}
                                                                                    <li
                                                                                        mobilelabel="Status"
                                                                                        className={
                                                                                            defaultClasses.item +
                                                                                            ' ' +
                                                                                            defaultClasses.body_item
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            e.status === 'pending' || e.status === 'Pending' ?
                                                                                            <FormattedMessage
                                                                                            id={
                                                                                                'myOrderView.Pending'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Pending'
                                                                                            } />
                                                                                        :
                                                                                            e.status === 'canceled' || e.status === 'Canceled' ? 
                                                                                            <FormattedMessage
                                                                                            id={
                                                                                                'myOrderView.Canceled'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Canceled'
                                                                                            } />
                                                                                        :
                                                                                            e.status === 'complete' || e.status === 'completed' || e.status === 'Complete' ? 
                                                                                            <FormattedMessage
                                                                                            id={
                                                                                                'myOrderView.Completed'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Completed'
                                                                                            } />
                                                                                            : 
                                                                                            e.status === 'processing' || e.status === 'Processing' ? 
                                                                                            <FormattedMessage
                                                                                            id={
                                                                                                'myOrderView.Processing'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Processing'
                                                                                            } />
                                                                                            :
                                                                                            e.status === 'new' || e.status === 'New' ? 
                                                                                            <FormattedMessage
                                                                                            id={
                                                                                                'myOrderView.New'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'New'
                                                                                            } />
                                                                                            :
                                                                                            e.status === 'closed' || e.status === 'Closed' ? 
                                                                                            <FormattedMessage
                                                                                            id={
                                                                                                'myOrderView.Closed'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Closed'
                                                                                            } />
                                                                                            :
                                                                                            e.status
                                                                                        }

                                                                                    </li>
                                                                                    {/* Products linked */}
                                                                                    <li
                                                                                        mobilelabel="Products linked to this project"
                                                                                        className={
                                                                                            defaultClasses.item +
                                                                                            ' ' +
                                                                                            defaultClasses.body_item
                                                                                        }
                                                                                    >

                                                                                        <OrderLines orderId={e.order_id} productReference={isId} orderNumber={e.order_id} category_id={isProject} />


                                                                                    </li>
                                                                                </ul>
                                                                            );
                                                                        }
                                                                        )}

                                                                    </div>

                                                                </div>
                                                            )}
                                                    </div>

                                                </div>
                                                <br />
                                                <Link
                                                    className={defaultClasses.btnPurchase}
                                                    to={resourceUrl('/myprojects?id=' + isProject)}
                                                >Return to project</Link>
                                                <br /><br />
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                );
            }
        }


        return (
            <FromProject email={email} category_id={isProject} />
        );
    } else {
        return (
            <div className={defaultClasses.columns}>
                <Title>{`My Orders - ${STORE_NAME}`}</Title>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div
                                className={
                                    defaultClasses.column +
                                    ' ' +
                                    defaultClasses.main
                                }
                            >
                                <div className={defaultClasses.account_sideBar}>
                                    <Sidebar history={props.history} />
                                </div>
                                <div
                                    className={
                                        defaultClasses.account_contentBar
                                    }
                                >
                                    <div
                                        className={
                                            defaultClasses.page_title_wrapper
                                        }
                                    >
                                        <h1
                                            className={
                                                defaultClasses.page_title
                                            }
                                        >
                                            <span
                                                className={defaultClasses.base}
                                            >
                                                <FormattedMessage
                                                    id={'myOrders.MyOrder'}
                                                    defaultMessage={'My Orders'}
                                                />
                                            </span>
                                        </h1>
                                    </div>
                                    <div
                                        className={
                                            defaultClasses.block +
                                            ' ' +
                                            defaultClasses.block_dashboard_orders
                                        }
                                    >
                                        <MyOrderSkelton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default MyOrders;

MyOrders.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
