import React from 'react';
import { shape, string } from 'prop-types';
import Classes from './myAccount.css';
import defaultClasses from './myOrderView.css';
import invoiceClasses from './invoice.css';
import Sidebar from './sidebar.js';
import { useInvoiceDetails } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { FormattedMessage } from 'react-intl';
import InvoiceQuery from '../../queries/getInvoices.graphql';
import { Redirect, Link } from 'src/drivers';
import { useParams } from 'react-router-dom';
import { Title } from '@magento/venia-ui/lib/components/Head';

const Invoice = props => {
    const { orderid } = useParams();
    const orderId = orderid;
    const InvoiceProps = useInvoiceDetails({
        query: InvoiceQuery,
        orderId: orderid
    });
    const { data, isSignedIn } = InvoiceProps;
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
                                        <div
                                            className={
                                                'd-flex align-items-center'
                                            }
                                        >
                                            <h1
                                                className={
                                                    defaultClasses.page_title
                                                }
                                            >
                                                <span
                                                    className={
                                                        defaultClasses.base
                                                    }
                                                >
                                                    {'Order # ' +
                                                        data.order_number}
                                                </span>
                                            </h1>
                                            <span
                                                className={
                                                    defaultClasses.order_status
                                                }
                                            >
                                                {data.order_status}
                                            </span>
                                        </div>
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
                                                        defaultClasses.action
                                                    }
                                                >
                                                    <Link
                                                        to={{
                                                            pathname:
                                                                '/printorder/' +
                                                                orderId
                                                        }}
                                                    >
                                                        Print Order
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
                                                                    'invoice.order'
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
                                                                        '/invoice/' +
                                                                        orderId
                                                                }}
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'invoice.invoice'
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
                                                                        'invoice.Shipment'
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
                                                                        'invoice.Refunds'
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
                                                    id={'invoice.itemsOrdered'}
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
                                            defaultClasses.ordered
                                        }
                                    >
                                        <div
                                            className={
                                                defaultClasses.order_title +
                                                ' ' +
                                                'd-flex justify-content-between'
                                            }
                                        >
                                            <strong>
                                                <FormattedMessage
                                                    id={'invoice.itemsOrdered'}
                                                    defaultMessage={
                                                        'Items Ordered'
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
                                                                'invoice.backToOrder'
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
                                            {data.invoices.map(
                                                (invoiceVal, invoiceIndex) => {
                                                    return (
                                                        <div
                                                            key={invoiceIndex}
                                                            className={
                                                                'clearfix' +
                                                                ' ' +
                                                                invoiceClasses.table_wrapper
                                                            }
                                                        >
                                                            <p
                                                                className={
                                                                    invoiceClasses.invoice_order_title
                                                                }
                                                            >
                                                                {'Invoice #' +
                                                                    invoiceVal.invoice_number}
                                                            </p>
                                                            <Title>{` Invoice # ${
                                                                invoiceVal.invoice_number
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
                                                                            'invoice.Product Name'
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
                                                                            'invoice.SKU'
                                                                        }
                                                                        defaultMessage={
                                                                            'SKU'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.price +
                                                                        ' ' +
                                                                        Classes.item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'invoice.Price'
                                                                        }
                                                                        defaultMessage={
                                                                            'Price'
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
                                                                            'invoice.ItemInvoiced'
                                                                        }
                                                                        defaultMessage={
                                                                            'Item Invoiced'
                                                                        }
                                                                    />
                                                                </li>
                                                                <li
                                                                    className={
                                                                        defaultClasses.subtotal +
                                                                        ' ' +
                                                                        Classes.item
                                                                    }
                                                                >
                                                                    <FormattedMessage
                                                                        id={
                                                                            'invoice.Subtotal'
                                                                        }
                                                                        defaultMessage={
                                                                            'Subtotal'
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
                                                                                        defaultClasses.price
                                                                                    }
                                                                                    data-th="Price"
                                                                                >
                                                                                    <span
                                                                                        className={
                                                                                            defaultClasses.price_excluding_tax
                                                                                        }
                                                                                        data-label="Excl. Tax"
                                                                                    >
                                                                                        <span
                                                                                            className={
                                                                                                defaultClasses.cart_price
                                                                                            }
                                                                                        >
                                                                                            <span
                                                                                                className={
                                                                                                    defaultClasses.price
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    val.price
                                                                                                }
                                                                                            </span>
                                                                                        </span>
                                                                                    </span>
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
                                                                                                    val.qty_invoiced
                                                                                                }
                                                                                            </span>
                                                                                        </li>
                                                                                    </ul>
                                                                                </li>
                                                                                <li
                                                                                    className={
                                                                                        'col' +
                                                                                        ' ' +
                                                                                        defaultClasses.subtotal
                                                                                    }
                                                                                    data-th="Subtotal"
                                                                                >
                                                                                    <span
                                                                                        className={
                                                                                            defaultClasses.price_excluding_tax
                                                                                        }
                                                                                        data-label="Excl. Tax"
                                                                                    >
                                                                                        <span
                                                                                            className={
                                                                                                defaultClasses.cart_price
                                                                                            }
                                                                                        >
                                                                                            <span
                                                                                                className={
                                                                                                    defaultClasses.price
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    val.subtotal
                                                                                                }
                                                                                            </span>{' '}
                                                                                        </span>
                                                                                    </span>
                                                                                </li>
                                                                            </ul>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                            <div
                                                                className={
                                                                    defaultClasses.table_footer
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        defaultClasses.subtotal
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            defaultClasses.mark
                                                                        }
                                                                    >
                                                                        <FormattedMessage
                                                                            id={
                                                                                'invoice.Subtotal'
                                                                            }
                                                                            defaultMessage={
                                                                                'Subtotal'
                                                                            }
                                                                        />
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            defaultClasses.amount
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                defaultClasses.price
                                                                            }
                                                                        >
                                                                            {
                                                                                invoiceVal.subtotal
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        defaultClasses.shipping
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            defaultClasses.mark
                                                                        }
                                                                    >
                                                                        Shipping
                                                                        &amp;
                                                                        Handling
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            defaultClasses.amount
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                defaultClasses.price
                                                                            }
                                                                        >
                                                                            {
                                                                                invoiceVal.tax
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        defaultClasses.grand_total
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            defaultClasses.mark
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            <FormattedMessage
                                                                                id={
                                                                                    'invoice.grand_total'
                                                                                }
                                                                                defaultMessage={
                                                                                    'Grand Total'
                                                                                }
                                                                            />
                                                                        </strong>
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            defaultClasses.amount
                                                                        }
                                                                    >
                                                                        <strong>
                                                                            <span
                                                                                className={
                                                                                    defaultClasses.price
                                                                                }
                                                                            >
                                                                                {
                                                                                    invoiceVal.subtotal
                                                                                }
                                                                            </span>
                                                                        </strong>
                                                                    </span>
                                                                </div>
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
                                                        'invoice.OrderInformation'
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
                                            {data &&
                                                data.shipping_address &&
                                                data.shipping_address != '' && (
                                                    <div
                                                        className={
                                                            defaultClasses.order_view_columns
                                                        }
                                                    >
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
                                                                            'invoice.order_shipping_address'
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
                                                                            'invoice.order_shipping_method'
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
                                                                {
                                                                    data.shipping_method
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
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
                                                                        'invoice.order_billing_address'
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
                                                                    'invoice.order_PaymentMethod'
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

export default Invoice;

Invoice.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
