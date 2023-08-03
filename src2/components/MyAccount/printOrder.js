import React from 'react';
import { shape, string } from 'prop-types';
import Classes from './myAccount.css';
import defaultClasses from './myOrderView.css';
import { useOrderDetails } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import OrderDetailsQuery from '../../queries/getOrderDetails.graphql';
import { Redirect } from 'src/drivers';
import { FormattedMessage } from 'react-intl';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useParams } from 'react-router-dom';

const loadingIndicator = (
    <LoadingIndicator>{`Fetching Order...`}</LoadingIndicator>
);

const PrintOrder = () => {
    const { orderid } = useParams();
    const orderProps = useOrderDetails({
        query: OrderDetailsQuery,
        orderId: orderid
    });
    const { data, isSignedIn } = orderProps;
    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    return (
        <div className={defaultClasses.columns}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className={Classes.column + ' ' + Classes.main}>
                            {typeof data != 'undefined' && (
                                <div
                                    className={
                                        Classes.account_contentBar +
                                        ' ' +
                                        defaultClasses.print_order_wrapper
                                    }
                                >
                                    <div
                                        className={
                                            defaultClasses.print_page_title +
                                            ' ' +
                                            'mb-3'
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
                                                        data.increment_id}
                                                </span>
                                            </h1>
                                            <span>
                                                <span
                                                    className={
                                                        defaultClasses.order_status
                                                    }
                                                >
                                                    {data.status}
                                                </span>
                                            </span>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.order_date
                                            }
                                        >
                                            <span>{data.created_at}</span>
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
                                                    id={
                                                        'PrintOrder.ItemsOrdered'
                                                    }
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
                                            defaultClasses.ordered +
                                            ' ' +
                                            'mt-sm-0'
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
                                                        'PrintOrder.ItemsOrdered'
                                                    }
                                                    defaultMessage={
                                                        'Items Ordered'
                                                    }
                                                />
                                            </strong>
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
                                            <div
                                                className={
                                                    'clearfix' +
                                                    ' ' +
                                                    defaultClasses.table_wrapper +
                                                    ' ' +
                                                    defaultClasses.order_items
                                                }
                                            >
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
                                                                'PrintOrder.ProductName'
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
                                                                'PrintOrder.SKU'
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
                                                                'PrintOrder.Price'
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
                                                                'PrintOrder.Qty'
                                                            }
                                                            defaultMessage={
                                                                'Qty'
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
                                                                'PrintOrder.Subtotal'
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
                                                    {data.items.map(
                                                        (val, index) => {
                                                            return (
                                                                <ul
                                                                    key={
                                                                        index +
                                                                        'items'
                                                                    }
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
                                                                                val.name
                                                                            }
                                                                        </strong>
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
                                                                            val.name
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
                                                                                        defaultClasses.title
                                                                                    }
                                                                                >
                                                                                    <FormattedMessage
                                                                                        id={
                                                                                            'PrintOrder.Ordered'
                                                                                        }
                                                                                        defaultMessage={
                                                                                            'Ordered : '
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                                <span
                                                                                    className={
                                                                                        defaultClasses.content
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        val.qty_ordered
                                                                                    }
                                                                                </span>
                                                                            </li>
                                                                            {val &&
                                                                                val.qty_shipped >
                                                                                    0 && (
                                                                                    <li
                                                                                        className={
                                                                                            defaultClasses.item
                                                                                        }
                                                                                    >
                                                                                        <span
                                                                                            className={
                                                                                                defaultClasses.title
                                                                                            }
                                                                                        >
                                                                                            <FormattedMessage
                                                                                                id={
                                                                                                    'PrintOrder.Shipped'
                                                                                                }
                                                                                                defaultMessage={
                                                                                                    'Shipped : '
                                                                                                }
                                                                                            />
                                                                                        </span>
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
                                                                                )}
                                                                            {val &&
                                                                                val.qty_refund >
                                                                                    0 && (
                                                                                    <li
                                                                                        className={
                                                                                            defaultClasses.item
                                                                                        }
                                                                                    >
                                                                                        <span
                                                                                            className={
                                                                                                defaultClasses.title
                                                                                            }
                                                                                        >
                                                                                            <FormattedMessage
                                                                                                id={
                                                                                                    'PrintOrder.Refunded'
                                                                                                }
                                                                                                defaultMessage={
                                                                                                    'Refunded : '
                                                                                                }
                                                                                            />
                                                                                        </span>
                                                                                        <span
                                                                                            className={
                                                                                                defaultClasses.content
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                val.qty_refund
                                                                                            }
                                                                                        </span>
                                                                                    </li>
                                                                                )}
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
                                                                                        val.row_total
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
                                                                    'PrintOrder.Subtotal'
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
                                                                {data.subtotal}
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
                                                            Shipping &amp;
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
                                                                {data.tax}
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
                                                                        'PrintOrder.GrandTotal'
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
                                                                        data.subtotal
                                                                    }
                                                                </span>
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
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
                                                        'PrintOrder.OrderInformation'
                                                    }
                                                    defaultMessage={
                                                        'Order Information'
                                                    }
                                                />
                                            </strong>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.address_wrap +
                                                ' ' +
                                                'd-flex' +
                                                ' ' +
                                                'flex-wrap'
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
                                                                            'PrintOrder.ShippingAddress'
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
                                                                            'PrintOrder.ShippingMethod'
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
                                                                        'PrintOrder.BillingAddress'
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
                                                                    'PrintOrder.PaymentMethod'
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
                            {typeof data == 'undefined' && (
                                <div className={defaultClasses.loader_wrapper}>
                                    {loadingIndicator}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintOrder;

PrintOrder.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
