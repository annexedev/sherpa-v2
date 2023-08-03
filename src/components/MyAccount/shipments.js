import React from 'react';
import { shape, string } from 'prop-types';
import Classes from './myAccount.css';
import defaultClasses from './myOrderView.css';
import invoiceClasses from './invoice.css';
import Sidebar from './sidebar.js';
import { FormattedMessage } from 'react-intl';

import { useShipmentDetails } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import ShipmentQuery from '../../queries/getShipments.graphql';
import { Redirect, Link } from 'src/drivers';
import { useParams } from 'react-router-dom';
import { Title } from '@magento/venia-ui/lib/components/Head';

const Shipments = props => {
    const { orderid } = useParams();
    const orderId = orderid;
    const ShipmentProps = useShipmentDetails({
        query: ShipmentQuery,
        orderId: orderid
    });
    const { data, isSignedIn } = ShipmentProps;
    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className={defaultClasses.columns}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className={Classes.column + ' ' + Classes.main}>
                            <div className={Classes.account_sideBar}>
                                <Sidebar
                                    history={props.history}
                                    activePath={'/myorders'}
                                />
                            </div>
                            {typeof data != 'undefined' && (
                                <div
                                    className={
                                        Classes.account_contentBar +
                                        ' ' +
                                        defaultClasses.column +
                                        ' ' +
                                        defaultClasses.main
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
                                                {'Order # ' + data.order_number}
                                            </span>
                                            <span
                                                className={
                                                    defaultClasses.order_status
                                                }
                                            >
                                                {data.order_status}
                                            </span>
                                        </h1>

                                        <div
                                            className={
                                                defaultClasses.order_date
                                            }
                                        >
                                            <span>{data.order_date}</span>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.actions_toolbar +
                                                ' ' +
                                                defaultClasses.order_actions_toolbar
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.actions +
                                                    ' ' +
                                                    defaultClasses.print
                                                }
                                            >
                                                {/* <span>
                                                    <a href="" className={defaultClasses.reorder_action}>Reorder</a>
                                                </span> */}
                                                <span
                                                    className={
                                                        defaultClasses.action +
                                                        ' ' +
                                                        defaultClasses.print
                                                    }
                                                >
                                                    <Link
                                                        to={{
                                                            pathname:
                                                                '/printorder/' +
                                                                orderId
                                                        }}
                                                    >
                                                        <FormattedMessage
                                                            id={
                                                                'shipment.PrintOrder'
                                                            }
                                                            defaultMessage={
                                                                'Print Order'
                                                            }
                                                        />
                                                    </Link>
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.actions_toolbar +
                                                ' ' +
                                                defaultClasses.order_actions_toolbar
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.actions +
                                                    ' ' +
                                                    'mt-3'
                                                }
                                            >
                                                {/* <span>
                                                    <span className={defaultClasses.reorder_action}>Reorder</span>
                                                </span> */}
                                                <span
                                                    className={
                                                        defaultClasses.print_link +
                                                        ' ' +
                                                        'ml-0'
                                                    }
                                                >
                                                    <span>
                                                        <Link
                                                            to={{
                                                                pathname:
                                                                    '/orderview/' +
                                                                    orderId
                                                            }}
                                                        >
                                                            <FormattedMessage
                                                                id={
                                                                    'shipment.ItemOrdered'
                                                                }
                                                                defaultMessage={
                                                                    'Item ordered'
                                                                }
                                                            />
                                                        </Link>
                                                    </span>
                                                </span>

                                                {data &&
                                                    data.hasInvoices ==
                                                        true && (
                                                        <span
                                                            className={
                                                                defaultClasses.action +
                                                                ' ' +
                                                                defaultClasses.print_link
                                                            }
                                                        >
                                                            <Link
                                                                to={{
                                                                    pathname:
                                                                        '/invoice/' +
                                                                        orderId
                                                                }}
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'shipment.Invoice'
                                                                    }
                                                                    defaultMessage={
                                                                        'Invoice'
                                                                    }
                                                                />
                                                            </Link>
                                                        </span>
                                                    )}
                                                {data &&
                                                    data.hasShipments ==
                                                        true && (
                                                        <span
                                                            className={
                                                                defaultClasses.active +
                                                                ' ' +
                                                                defaultClasses.action +
                                                                ' ' +
                                                                defaultClasses.print_link
                                                            }
                                                        >
                                                            <Link
                                                                to={{
                                                                    pathname:
                                                                        '/shipment/' +
                                                                        orderId
                                                                }}
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'shipment.Shipment'
                                                                    }
                                                                    defaultMessage={
                                                                        'Shipment'
                                                                    }
                                                                />
                                                            </Link>
                                                        </span>
                                                    )}
                                                {data &&
                                                    data.hasCreditmemos ==
                                                        true && (
                                                        <span
                                                            className={
                                                                defaultClasses.action +
                                                                ' ' +
                                                                defaultClasses.print_link
                                                            }
                                                        >
                                                            <Link
                                                                to={{
                                                                    pathname:
                                                                        '/refunds/' +
                                                                        orderId
                                                                }}
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'shipment.Refunds'
                                                                    }
                                                                    defaultMessage={
                                                                        'Refunds'
                                                                    }
                                                                />
                                                            </Link>
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <ul
                                        className={
                                            defaultClasses.items +
                                            ' ' +
                                            defaultClasses.order_links
                                        }
                                    >
                                        <li
                                            className={
                                                'nav' +
                                                ' ' +
                                                defaultClasses.item +
                                                ' ' +
                                                defaultClasses.current
                                            }
                                        >
                                            <strong>
                                                <FormattedMessage
                                                    id={'shipment.ItemsOrdered'}
                                                    defaultMessage={
                                                        'Items Ordered'
                                                    }
                                                />
                                            </strong>
                                        </li>
                                    </ul>
                                    <div
                                        className={
                                            defaultClasses.order_details_items +
                                            ' ' +
                                            invoiceClasses.ordered +
                                            ' ' +
                                            defaultClasses.ordered
                                        }
                                    >
                                        <div
                                            className={
                                                defaultClasses.order_title +
                                                ' ' +
                                                'd-flex' +
                                                ' ' +
                                                'justify-content-between'
                                            }
                                        >
                                            <strong>
                                                <FormattedMessage
                                                    id={
                                                        'shipment.OrderShipments'
                                                    }
                                                    defaultMessage={
                                                        'Order Shipments'
                                                    }
                                                />
                                            </strong>
                                            <span
                                                className={
                                                    defaultClasses.action +
                                                    ' ' +
                                                    defaultClasses.back
                                                }
                                            >
                                                <span>
                                                    <Link
                                                        to={{
                                                            pathname:
                                                                '/myorders/'
                                                        }}
                                                    >
                                                        <FormattedMessage
                                                            id={
                                                                'shipment.BackToOrders'
                                                            }
                                                            defaultMessage={
                                                                'Back to My Orders'
                                                            }
                                                        />
                                                    </Link>
                                                </span>
                                            </span>
                                        </div>

                                        <div
                                            className={
                                                defaultClasses.data +
                                                ' ' +
                                                'table' +
                                                ' ' +
                                                defaultClasses.table_order_items
                                            }
                                            id="my-orders-table"
                                            summary="Items Ordered"
                                        >
                                            {data.shipment.map(
                                                (invoiceVal, invoiceIndex) => {
                                                    return (
                                                        <div
                                                            key={invoiceIndex}
                                                            className={
                                                                'clearfix' +
                                                                ' ' +
                                                                invoiceClasses.table_wrapper +
                                                                ' ' +
                                                                defaultClasses.order_items
                                                            }
                                                        >
                                                            <p
                                                                className={
                                                                    invoiceClasses.invoice_order_title
                                                                }
                                                            >
                                                                {'Shipment #' +
                                                                    invoiceVal.shipment_number}
                                                            </p>
                                                            <Title>{`Shipment # ${
                                                                invoiceVal.shipment_number
                                                            } - ${STORE_NAME}`}</Title>
                                                            <ul
                                                                className={
                                                                    Classes.table_wrapper_head +
                                                                    ' ' +
                                                                    defaultClasses.table_head
                                                                }
                                                            >
                                                                <li
                                                                    className={
                                                                        defaultClasses.name +
                                                                        ' ' +
                                                                        Classes.item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'shipment.ProductName'
                                                                        }
                                                                        defaultMessage={
                                                                            'Product Name'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.sku +
                                                                        ' ' +
                                                                        Classes.item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'shipment.SKU'
                                                                        }
                                                                        defaultMessage={
                                                                            'SKU'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.qty +
                                                                        ' ' +
                                                                        Classes.item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'shipment.QtyShipped'
                                                                        }
                                                                        defaultMessage={
                                                                            'Qty Shipped'
                                                                        }
                                                                    />
                                                                </li>
                                                            </ul>
                                                            <div
                                                                className={
                                                                    Classes.table_wrapper_body
                                                                }
                                                            >
                                                                {invoiceVal.item.map(
                                                                    (
                                                                        val,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <ul
                                                                                className={
                                                                                    Classes.orders_row +
                                                                                    ' ' +
                                                                                    defaultClasses.order_view
                                                                                }
                                                                                index={
                                                                                    index
                                                                                }
                                                                                id="order-item-row-111"
                                                                            >
                                                                                <li
                                                                                    className={
                                                                                        'col' +
                                                                                        ' ' +
                                                                                        defaultClasses.name
                                                                                    }
                                                                                    data-th="Product Name"
                                                                                >
                                                                                    <strong
                                                                                        className={
                                                                                            defaultClasses.product +
                                                                                            ' ' +
                                                                                            defaultClasses.product_item_name
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            val.product_name
                                                                                        }
                                                                                    </strong>
                                                                                    {val &&
                                                                                        val.options &&
                                                                                        val.options.map(
                                                                                            (
                                                                                                optionVal,
                                                                                                optionIndex
                                                                                            ) => {
                                                                                                return (
                                                                                                    <div
                                                                                                        key={
                                                                                                            optionIndex
                                                                                                        }
                                                                                                        class={
                                                                                                            defaultClasses.optionLabel
                                                                                                        }
                                                                                                    >
                                                                                                        <dt>
                                                                                                            {
                                                                                                                optionVal.label
                                                                                                            }
                                                                                                        </dt>
                                                                                                        <dd
                                                                                                            class={
                                                                                                                defaultClasses.optionValue
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                optionVal.value
                                                                                                            }
                                                                                                        </dd>
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </li>
                                                                                <li
                                                                                    className={
                                                                                        'col' +
                                                                                        ' ' +
                                                                                        defaultClasses.sku
                                                                                    }
                                                                                    data-th="SKU"
                                                                                >
                                                                                    {
                                                                                        val.sku
                                                                                    }
                                                                                </li>
                                                                                <li
                                                                                    className={
                                                                                        'col' +
                                                                                        ' ' +
                                                                                        defaultClasses.qty
                                                                                    }
                                                                                    data-th="Qty"
                                                                                >
                                                                                    <ul
                                                                                        className={
                                                                                            defaultClasses.items_qty
                                                                                        }
                                                                                    >
                                                                                        <li
                                                                                            className={
                                                                                                defaultClasses.item
                                                                                            }
                                                                                        >
                                                                                            <span
                                                                                                className={
                                                                                                    defaultClasses.content
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    val.qty_shipped
                                                                                                }
                                                                                            </span>
                                                                                        </li>
                                                                                    </ul>
                                                                                </li>
                                                                            </ul>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            defaultClasses.block +
                                            ' ' +
                                            defaultClasses.block_order_details_view
                                        }
                                    >
                                        <div
                                            className={
                                                defaultClasses.block_title
                                            }
                                        >
                                            <strong>
                                                <FormattedMessage
                                                    id={
                                                        'shipment.OrderInformation'
                                                    }
                                                    defaultMessage={
                                                        'Order Information'
                                                    }
                                                />
                                            </strong>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.address_wrap
                                            }
                                        >
                                            <div
                                                className={
                                                    defaultClasses.order_view_columns
                                                }
                                            >
                                                {typeof data.shipping_address !=
                                                    'undefined' && (
                                                    <div
                                                        className={
                                                            defaultClasses.box +
                                                            ' ' +
                                                            defaultClasses.box_order_shipping_address
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
                                                                        'shipment.ShippingAddress'
                                                                    }
                                                                    defaultMessage={
                                                                        'Shipping Address'
                                                                    }
                                                                />
                                                            </span>
                                                        </strong>
                                                        <div
                                                            className={
                                                                defaultClasses.box_content
                                                            }
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    data.shipping_address
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    className={
                                                        defaultClasses.box +
                                                        ' ' +
                                                        defaultClasses.box_order_shipping_method
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
                                                                    'shipment.ShippingMethod'
                                                                }
                                                                defaultMessage={
                                                                    'Shipping Method'
                                                                }
                                                            />
                                                        </span>
                                                    </strong>
                                                    <div
                                                        className={
                                                            defaultClasses.box_content
                                                        }
                                                    >
                                                        {data.shipping_method}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    defaultClasses.order_view_columns
                                                }
                                            >
                                                {typeof data.billing_address !=
                                                    'undefined' && (
                                                    <div
                                                        className={
                                                            defaultClasses.box +
                                                            ' ' +
                                                            defaultClasses.box_order_billing_address
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
                                                                        'shipment.BillingAddress'
                                                                    }
                                                                    defaultMessage={
                                                                        'Billing Address'
                                                                    }
                                                                />
                                                            </span>
                                                        </strong>
                                                        <div
                                                            className={
                                                                defaultClasses.box_content
                                                            }
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    data.billing_address
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    className={
                                                        defaultClasses.box +
                                                        ' ' +
                                                        defaultClasses.box_order_billing_method
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
                                                                    'shipment.PaymentMethod'
                                                                }
                                                                defaultMessage={
                                                                    'Payment Method'
                                                                }
                                                            />
                                                        </span>
                                                    </strong>
                                                    <div
                                                        className={
                                                            defaultClasses.box_content
                                                        }
                                                    >
                                                        {data.payment}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shipments;

Shipments.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
