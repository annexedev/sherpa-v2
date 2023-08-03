import React from 'react';
import { shape, string } from 'prop-types';
import Classes from './myAccount.css';
import defaultClasses from './myOrderView.css';
import invoiceClasses from './invoice.css';
import Sidebar from './sidebar.js';
import { useRefunds } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { FormattedMessage } from 'react-intl';
import RefundsQuery from '../../queries/getRefunds.graphql';
import { Redirect, Link } from 'src/drivers';
import { useParams } from 'react-router-dom';

const Refunds = props => {
    const { orderid } = useParams();
    const orderId = orderid;
    const RefundsProps = useRefunds({
        query: RefundsQuery,
        orderId
    });
    const { data, isSignedIn } = RefundsProps;
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
                                                                'refund.PrintOrder'
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
                                                    defaultClasses.actions
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
                                                                    'refund.ItemOrdered'
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
                                                                        'refund.Invoice'
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
                                                                        'refund.Shipment'
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
                                                                        '/refunds/' +
                                                                        orderId
                                                                }}
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'refund.Refunds'
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
                                                    id={'refund.ItemsOrdered'}
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
                                                'd-flex' +
                                                ' ' +
                                                'justify-content-between'
                                            }
                                        >
                                            <strong>
                                                <FormattedMessage
                                                    id={'refund.Refunds'}
                                                    defaultMessage={'Refunds'}
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
                                                                'refund.BackToOrders'
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
                                            {data.refunds.map(
                                                (refundVal, refundIndex) => {
                                                    return (
                                                        <div
                                                            key={refundIndex}
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
                                                                {'Refund #' +
                                                                    refundVal.increment_id}
                                                            </p>
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
                                                                            'refund.ProductName'
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
                                                                            'refund.SKU'
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
                                                                            'refund.Price'
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
                                                                            'refund.QtyRefunded'
                                                                        }
                                                                        defaultMessage={
                                                                            'Qty Refunded'
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
                                                                            'refund.Subtotal'
                                                                        }
                                                                        defaultMessage={
                                                                            'Subtotal'
                                                                        }
                                                                    />
                                                                </li>
                                                            </ul>
                                                            <div
                                                                key={
                                                                    refundIndex
                                                                }
                                                                className={
                                                                    Classes.table_wrapper_body
                                                                }
                                                            >
                                                                {refundVal.item.map(
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
                                                                                                    val.qty_refunded
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
                                                                                'refund.Subtotal'
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
                                                                                refundVal.subtotal
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
                                                                                refundVal.shipping_amount
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
                                                                                    'refund.Grand Total'
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
                                                                                    refundVal.grand_total
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Refunds;

Refunds.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
