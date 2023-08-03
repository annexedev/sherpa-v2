import React from 'react';
import defaultClasses from './myAccount.css';
import Sidebar from './sidebar.js';
import {
    useDashboard,
    useCustomerOrder
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import CustomerOrder from '../../queries/getCustomerOrderList.graphql';
import { FormattedMessage, useIntl } from 'react-intl';
import { Redirect, Link } from 'src/drivers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import searchClasses from '../SearchPage/searchPage.css';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import { Title } from '@magento/venia-ui/lib/components/Head';

const MyAccount = props => {
    const { formatMessage } = useIntl();
    const talonProps = useDashboard(); 
    const {
        name,
        email,
        billingAddress,
        shippingAddress,
        isSignedIn,
        is_subscribed
    } = talonProps;

    const orderProps = useCustomerOrder({
        query: CustomerOrder,
        customerQuery: GET_CUSTOMER_QUERY
    });
    const { data } = orderProps;
    const subscriptionMsg = is_subscribed
        ? formatMessage({
              id: 'account.is_subscribed',
              defaultMessage: 'You are subscribed to "General Subscription". '
          })
        : formatMessage({
              id: 'account.is_not_subscribed',
              defaultMessage: "You aren't subscribed to our newsletter."
          });

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }
    return (
        <div className={defaultClasses.columns}>
            <Title>{`My Account - ${STORE_NAME}`}</Title>
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

                            <div className={defaultClasses.account_contentBar}>
                                <div
                                    className={
                                        defaultClasses.page_title_wrapper
                                    }
                                >
                                    <h1 className={defaultClasses.page_title}>
                                        <span className={defaultClasses.base}>
                                            <FormattedMessage
                                                id={'account.page_title'}
                                                defaultMessage={'My Account'}
                                            />
                                        </span>
                                    </h1>
                                </div>
                                <div
                                    className={
                                        defaultClasses.block +
                                        ' ' +
                                        defaultClasses.block_dashboard_info
                                    }
                                >
                                    <div className={defaultClasses.block_title}>
                                        <strong>
                                            <FormattedMessage
                                                id={
                                                    'account.AccountInformation'
                                                }
                                                defaultMessage={
                                                    'Account Information'
                                                }
                                            />
                                        </strong>
                                    </div>
                                    <div
                                        className={defaultClasses.block_content}
                                    >
                                        <div
                                            className={
                                                defaultClasses.box +
                                                ' ' +
                                                defaultClasses.box_information
                                            }
                                        >
                                            <strong
                                                className={
                                                    defaultClasses.box_title
                                                }
                                            >
                                                <span>
                                                    <FormattedMessage
                                                        id={
                                                            'account.ContactInformation'
                                                        }
                                                        defaultMessage={
                                                            'Contact Information'
                                                        }
                                                    />
                                                </span>
                                            </strong>
                                            <div
                                                className={
                                                    defaultClasses.box_content
                                                }
                                            >
                                                <p
                                                    className={
                                                        defaultClasses.box_content_info
                                                    }
                                                >
                                                    <p className={'mb-1'}>
                                                        {name}
                                                    </p>
                                                    <p>{email}</p>
                                                </p>
                                                <Link
                                                    className={
                                                        defaultClasses.edit
                                                    }
                                                    to="/profile"
                                                >
                                                    <img
                                                        src="/cenia-static/images/icons8-edit-48.png"
                                                        alt="edit"
                                                        height="20"
                                                    />
                                                </Link>
                                            </div>
                                            <div
                                                className={
                                                    defaultClasses.box_actions
                                                }
                                            >
                                                <Link
                                                    to={{
                                                        pathname: '/profile',
                                                        state: {
                                                            password: true
                                                        }
                                                    }}
                                                    className={
                                                        defaultClasses.action +
                                                        ' ' +
                                                        defaultClasses.change_password
                                                    }
                                                >
                                                    <FormattedMessage
                                                        id={
                                                            'account.change_password'
                                                        }
                                                        defaultMessage={
                                                            'Change Password'
                                                        }
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.box +
                                                ' ' +
                                                defaultClasses.box_newsletter
                                            }
                                        >
                                            <strong
                                                className={
                                                    defaultClasses.box_title
                                                }
                                            >
                                                <span>
                                                    <FormattedMessage
                                                        id={
                                                            'account.Newsletters'
                                                        }
                                                        defaultMessage={
                                                            'Newsletters'
                                                        }
                                                    />
                                                </span>
                                            </strong>
                                            <div
                                                className={
                                                    defaultClasses.box_content
                                                }
                                            >
                                                <p
                                                    className={
                                                        defaultClasses.box_content_info
                                                    }
                                                >
                                                    {subscriptionMsg}
                                                </p>
                                                <Link
                                                    className={
                                                        defaultClasses.edit
                                                    }
                                                    to="/newsletter"
                                                >
                                                    <img
                                                        src="/cenia-static/images/icons8-edit-48.png"
                                                        alt="edit"
                                                        width="20"
                                                        height="20"
                                                    />
                                                </Link>
                                            </div>
                                            <div
                                                className={
                                                    defaultClasses.box_actions
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={
                                        defaultClasses.block +
                                        ' ' +
                                        defaultClasses.block_dashboard_addresses
                                    }
                                >
                                    <div className={defaultClasses.block_title}>
                                        <strong>
                                            <FormattedMessage
                                                id={'account.AddressBook'}
                                                defaultMessage={' Address Book'}
                                            />
                                        </strong>
                                        {/* <Link
                                            className={
                                                defaultClasses.manage_address
                                            }
                                            to="/addresses"
                                        >
                                            <span>
                                                <FormattedMessage
                                                    id={
                                                        'account.manage_address'
                                                    }
                                                    defaultMessage={
                                                        'Manage Addresses'
                                                    }
                                                />
                                            </span>
                                                </Link> */}
                                    </div>
                                    <div
                                        className={defaultClasses.block_content}
                                    >
                                        <div
                                            className={
                                                defaultClasses.box +
                                                ' ' +
                                                defaultClasses.box_information
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.box_content
                                                }
                                            >
                                                {typeof billingAddress !=
                                                    'undefined' && (
                                                    <div className={'w-100'}>
                                                        <strong
                                                            className={
                                                                defaultClasses.box_title
                                                            }
                                                        >
                                                            <span>
                                                                <FormattedMessage
                                                                    id={
                                                                        'account.DefaultBillingAddress'
                                                                    }
                                                                    defaultMessage={
                                                                        'Default Billing Address'
                                                                    }
                                                                />
                                                            </span>
                                                        </strong>
                                                        <div
                                                            className={
                                                                defaultClasses.box_content
                                                            }
                                                        >
                                                            <address
                                                                className={
                                                                    defaultClasses.box_content_info
                                                                }
                                                            >
                                                                {billingAddress.firstname +
                                                                    ' ' +
                                                                    billingAddress.lastname}
                                                                <br />
                                                                {
                                                                    billingAddress
                                                                        .street[0]
                                                                }
                                                                <br />
                                                                {
                                                                    billingAddress.city
                                                                }
                                                                ,{' '}
                                                                {
                                                                    billingAddress
                                                                        .region
                                                                        .region
                                                                }
                                                                ,{' '}
                                                                {
                                                                    billingAddress.postcode
                                                                }
                                                                ,{' '}
                                                                {
                                                                    billingAddress.country_id
                                                                }
                                                                <br />
                                                                T:{' '}
                                                                <a
                                                                    href={
                                                                        'tel:' +
                                                                        billingAddress.telephone
                                                                    }
                                                                >
                                                                    {
                                                                        billingAddress.telephone
                                                                    }
                                                                </a>
                                                            </address>
                                                        </div>
                                                        <div
                                                            className={
                                                                defaultClasses.box_actions
                                                            }
                                                        >
                                                            {billingAddress &&
                                                                billingAddress.id && (
                                                                    
                                                                    <Link
                                                                        className={
                                                                            defaultClasses.action +
                                                                            ' ' +
                                                                            defaultClasses.change_password
                                                                        }
                                                                        to={
                                                                            '#'
                                                                        }
                                                                        data-ui-id="default-billing-edit-link"
                                                                    >
                                                                        <FormattedMessage
                                                                            id={
                                                                                'account.EditAddress'
                                                                            }
                                                                            defaultMessage={
                                                                                'Please contact your account manager to update your billing address'
                                                                            }
                                                                        />
                                                                        </Link> 
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                                {typeof billingAddress ==
                                                    'undefined' && (
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
                                                                    'account.noResult_text_product'
                                                                }
                                                                defaultMessage={
                                                                    'No products Available!'
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.box +
                                                ' ' +
                                                defaultClasses.box_information
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.box_content
                                                }
                                            >
                                                {typeof shippingAddress !=
                                                    'undefined' && (
                                                    <div className={'w-100'}>
                                                        <strong
                                                            className={
                                                                defaultClasses.box_title
                                                            }
                                                        >
                                                            <span>
                                                                <FormattedMessage
                                                                    id={
                                                                        'account.DefaultShippingAddress'
                                                                    }
                                                                    defaultMessage={
                                                                        'Default Shipping Address'
                                                                    }
                                                                />
                                                            </span>
                                                        </strong>
                                                        <div
                                                            className={
                                                                defaultClasses.box_content
                                                            }
                                                        >
                                                            <address
                                                                className={
                                                                    defaultClasses.box_content_info
                                                                }
                                                            >
                                                                {shippingAddress.firstname +
                                                                    ' ' +
                                                                    shippingAddress.lastname}
                                                                <br />
                                                                {
                                                                    shippingAddress
                                                                        .street[0]
                                                                }
                                                                <br />
                                                                {
                                                                    shippingAddress.city
                                                                }
                                                                ,{' '}
                                                                {
                                                                    shippingAddress
                                                                        .region
                                                                        .region
                                                                }
                                                                ,{' '}
                                                                {
                                                                    shippingAddress.postcode
                                                                }
                                                                ,{' '}
                                                                {
                                                                    shippingAddress.country_id
                                                                }
                                                                <br />
                                                                T:{' '}
                                                                <a
                                                                    href={
                                                                        'tel:' +
                                                                        shippingAddress.telephone
                                                                    }
                                                                >
                                                                    {
                                                                        shippingAddress.telephone
                                                                    }
                                                                </a>
                                                            </address>
                                                        </div>
                                                        <div
                                                            className={
                                                                defaultClasses.box_actions
                                                            }
                                                        >
                                                            {shippingAddress &&
                                                                shippingAddress.id && (
                                                                    <Link
                                                                        className={
                                                                            defaultClasses.action +
                                                                            ' ' +
                                                                            defaultClasses.change_password
                                                                        }
                                                                        to={
                                                                            '#'
                                                                        }
                                                                        data-ui-id="default-shipping-edit-link"
                                                                    >
                                                                        <FormattedMessage
                                                                            id={
                                                                                'account.EditAddress'
                                                                            }
                                                                            defaultMessage={
                                                                                'Please contact your account manager to update your shipping address'
                                                                            }
                                                                        />
                                                                    </Link>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={
                                        defaultClasses.block +
                                        ' ' +
                                        defaultClasses.block_dashboard_orders
                                    }
                                >
                                    <div className={defaultClasses.block_title}>
                                        <strong>
                                            <FormattedMessage
                                                id={'account.RecentOrders'}
                                                defaultMessage={'Recent Orders'}
                                            />
                                        </strong>
                                        <Link
                                            className={defaultClasses.view}
                                            to="/orders"
                                        >
                                            <span>
                                                <FormattedMessage
                                                    id={'account.ViewAll'}
                                                    defaultMessage={'View All'}
                                                />
                                            </span>
                                        </Link>
                                    </div>
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
                                                                        'account.Order'
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
                                                                        'account.Date'
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
                                                                        'account.ShipTo'
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
                                                                        'account.OrderTotal'
                                                                    }
                                                                    defaultMessage={
                                                                        'OrderTotal'
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
                                                                        'account.Status'
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
                                                                        'account.Action'
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
                                                                                        defaultClasses.body_item_link
                                                                                    }
                                                                                    to={
                                                                                        '/orderview/' +
                                                                                        val.id
                                                                                    }
                                                                                >
                                                                                    <FormattedMessage
                                                                                        id={
                                                                                            'account.ViewOrder'
                                                                                        }
                                                                                        defaultMessage={
                                                                                            'View Order'
                                                                                        }
                                                                                    />
                                                                                </Link>
                                                                            </li>
                                                                        </ul>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            {data && data.length == 0 && (
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
                                                                'account.noResult_text_orders'
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
};

export default MyAccount;
