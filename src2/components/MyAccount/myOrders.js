import React from 'react';
import { shape, string } from 'prop-types';
import defaultClasses from './myAccount.css';
import searchClasses from '../SearchPage/searchPage.css';
import Sidebar from './sidebar.js';
import { useCustomerOrder } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { FormattedMessage } from 'react-intl';
import CustomerOrder from '../../queries/getCustomerOrderList.graphql';
import { Link, Redirect } from 'src/drivers';
import MyOrderSkelton from './MyOrderSkeleton.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@magento/venia-ui/lib/components/Head';

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
    if (!loading) {
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
                                                    defaultMessage={'My Order'}
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
                                                                            'Action'
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
                                                                                    {
                                                                                        val.increment_id
                                                                                    }
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
                                                                                        val.created_at
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
                                                                                    {
                                                                                        val.status
                                                                                    }
                                                                                </li>
                                                                                <li
                                                                                    mobilelabel="Action"
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
                                                                                        <FormattedMessage
                                                                                            id={
                                                                                                'myOrders.ViewOrder'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'View Order'
                                                                                            }
                                                                                        />
                                                                                    </Link>
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
                                                    defaultMessage={'My Order'}
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
