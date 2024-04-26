import React, { useEffect, Component } from 'react';
import { shape, string } from 'prop-types';
import Classes from './myAccount.css';
import defaultClasses from './myOrderView.css';
import Sidebar from './sidebar.js';
import {
    useOrderDetails,
    useReorder
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import OrderDetailsQuery from '../../queries/getOrderDetails.graphql';
import ReorderMutation from '../../queries/reorder.graphql';
import { FormattedMessage } from 'react-intl';
import { Redirect, Link } from 'src/drivers';
import LoadingIndicator from '../LoadingIndicator';
import { useHistory, useParams } from 'react-router-dom';
import { Title } from '@magento/venia-ui/lib/components/Head';

const loadingIndicator = (
    <LoadingIndicator>{`Fetching Order...`}</LoadingIndicator>
);

const MyOrderView = props => {
    const { who } = useParams();
    const orderProps = useOrderDetails({
        query: OrderDetailsQuery,
        orderId: who
    });
    const { handleReorder, isSignedIn, reoderResponse } = useReorder({
        query: ReorderMutation
    });

    const history = useHistory();
    const { data, orderId } = orderProps;

    useEffect(() => {
        if (reoderResponse && reoderResponse.reorderItems) {
            var err = reoderResponse.reorderItems.userInputErrors;
            if (err.length == 0) {
                history.push('/cart');
            }
        }
    }, [reoderResponse, handleReorder, history]);
    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

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

    class ProjectOrder extends Component {
        constructor() {
            super();
            this.state = {
                pageData: []
            };
        }

        componentDidMount() {
            let order_id = this.props.order_id;
            let item_id = this.props.item_id;
            let dataURL =
                'https://data.sherpagroupav.com/get_projet_by_order.php?order_id=' + order_id + '&item_id=' + item_id;

            fetch(dataURL)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        pageData: res
                    });
                });
        }

        render() {
            let orderProject = this.state.pageData.orderProject && this.state.pageData.orderProject;
            return (
                <React.Fragment>
                    <span className={defaultClasses.action + ' ' + defaultClasses.back} dangerouslySetInnerHTML={{ __html: orderProject }}></span>
                </React.Fragment>
            );
        }
    }

    // console.log('DATA');
    console.log(data);

    return (
        <div className={defaultClasses.columns}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className={Classes.column + ' ' + Classes.main}>
                            <div className={Classes.account_sideBar}>
                                <Sidebar
                                    history={props.history}
                                    activePath={'/orderview'}
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
                                                <Title>{` Order # ${data.increment_id
                                                    } - ${STORE_NAME}`}</Title>
                                                <span
                                                    className={
                                                        defaultClasses.base
                                                    }
                                                >
                                                    <FormattedMessage
                                                            id={
                                                                'myOrderView.Order'
                                                            }
                                                            defaultMessage={
                                                                'Order'
                                                            }
                                                    />
                                                    {' ' + '#' + ' ' + data.increment_id}
                                                </span>
                                            </h1>
                                            <span
                                                className={
                                                    defaultClasses.order_status
                                                }
                                            >
                                                {data.status === 'Pending' ? <FormattedMessage
                                                            id={
                                                                'myOrderView.Pending'
                                                            }
                                                            defaultMessage={
                                                                'Pending'
                                                            }
                                                    /> : data.status}
                                            </span>
                                        </div>
                                        <div
                                            className={
                                                defaultClasses.order_date
                                            }
                                        >
                                            <span>{data.created_at}</span>
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
                                                {data.status != 'Pending' && <button
                                                    className={
                                                        defaultClasses.reorder_action
                                                    }
                                                    onClick={() => {
                                                        handleReorder({
                                                            orderNumber:
                                                                data.increment_id
                                                        });
                                                    }}
                                                >
                                                    <span>
                                                        {' '}
                                                        <FormattedMessage
                                                            id={
                                                                'myOrderView.ReOrder'
                                                            }
                                                            defaultMessage={
                                                                'Reorder'
                                                            }
                                                        />
                                                    </span>
                                                </button> }
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
                                                        <FormattedMessage
                                                            id={
                                                                'myOrderView.PrintOrder'
                                                            }
                                                            defaultMessage={
                                                                'Print Order'
                                                            }
                                                        />
                                                    </Link>
                                                </span>
                                            </div>
                                        </div>
                                        {data &&
                                            data.comment &&
                                            data.comment.length != 0 && (
                                                <>
                                                    <div>
                                                        <br />
                                                        <h3>
                                                            {' '}
                                                            <FormattedMessage
                                                                id={
                                                                    'myOrderView.aboutYourOrder'
                                                                }
                                                                defaultMessage={
                                                                    'About Your Order'
                                                                }
                                                            />
                                                        </h3>
                                                        <hr />
                                                        <strong>
                                                            {
                                                                data.comment[0]
                                                                    .create_at
                                                            }
                                                        </strong>
                                                        <p>
                                                            {
                                                                data.comment[0]
                                                                    .comment
                                                            }
                                                        </p>
                                                    </div>
                                                </>
                                            )}
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
                                                <span
                                                    className={
                                                        defaultClasses.active +
                                                        ' ' +
                                                        defaultClasses.print_link +
                                                        ' ' +
                                                        'ml-0'
                                                    }
                                                >
                                                    <Link
                                                        to={{
                                                            pathname:
                                                                '/orderview/' +
                                                                orderId
                                                        }}
                                                    >
                                                        <FormattedMessage
                                                            id={
                                                                'myOrderView.ItemOrdered'
                                                            }
                                                            defaultMessage={
                                                                'Item ordered'
                                                            }
                                                        />
                                                    </Link>
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
                                                                        'myOrderView.Invoice'
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
                                                                        'myOrderView.Shipment'
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
                                                            <ProjectOrder item_id={val.id} order_id={orderId} />
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
                                                    id={
                                                        'myOrderView.ItemsOrdered'
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
                                            <strong></strong>
                                            <span
                                                className={
                                                    defaultClasses.action +
                                                    ' ' +
                                                    defaultClasses.back
                                                }
                                            >
                                                <Link to={'/orders'}>
                                                    <FormattedMessage
                                                        id={
                                                            'myOrderView.BackToOrders'
                                                        }
                                                        defaultMessage={
                                                            'Back to My Orders'
                                                        }
                                                    />
                                                </Link>
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
                                                        Classes.table_wrapper_head_checkout +
                                                        ' ' +
                                                        defaultClasses.table_head
                                                    }
                                                >
                                                    <li
                                                        className={
                                                            defaultClasses.sku +
                                                            ' ' +
                                                            Classes.item
                                                        }
                                                    >
                                                        <FormattedMessage
                                                            id={
                                                                'myOrderView.SKU'
                                                            }
                                                            defaultMessage={
                                                                'Part #'
                                                            }
                                                        />
                                                    </li>

                                                    <li
                                                        className={
                                                            defaultClasses.name +
                                                            ' ' +
                                                            Classes.item
                                                        }
                                                    >
                                                        <FormattedMessage
                                                            id={
                                                                'myOrderView.ProductName'
                                                            }
                                                            defaultMessage={
                                                                'Product Name'
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
                                                                'myOrderView.Qty'
                                                            }
                                                            defaultMessage={
                                                                'Qty'
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
                                                                'myOrderView.Price'
                                                            }
                                                            defaultMessage={
                                                                'Price'
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
                                                                'myOrderView.Subtotal'
                                                            }
                                                            defaultMessage={
                                                                'Subtotal'
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
                                                                'myOrderView.associated'
                                                            }
                                                            defaultMessage={
                                                                'Associated with project'
                                                            }
                                                        />
                                                    </li>

                                                </ul>
                                                <div
                                                    className={
                                                        Classes.table_wrapper_body_checkout
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
                                                                                {/* <span
                                                                                    className={
                                                                                        defaultClasses.title
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        'Ordered : '
                                                                                    }{' '}
                                                                                </span> */}
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
                                                                                            {
                                                                                                'Shipped : '
                                                                                            }{' '}
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
                                                                                            {
                                                                                                'Refunded : '
                                                                                            }{' '}
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

                                                                    <li
                                                                        className={
                                                                            'col' +
                                                                            ' ' +
                                                                            defaultClasses.sku
                                                                        }
                                                                        data-th="Associated"
                                                                    >


                                                                        <ProjectOrder item_id={val.id} order_id={orderId} />

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
                                                                    'myOrderView.Subtotal'
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
                                                    {data.discount_amount !=
                                                        '0' && (
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
                                                                    {data.discount_description
                                                                        ? 'Discount (' +
                                                                        data.discount_description +
                                                                        ')'
                                                                        : 'Discount'}
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
                                                                            data.discount_amount
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        )}
                                                    {data.shipping != '0' && (
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
                                                                    {
                                                                        data.shipping
                                                                    }
                                                                </span>
                                                            </span>
                                                        </div>
                                                    )}
                                                    {data.tax != '0' && (
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
                                                                <FormattedMessage
                                                                    id={
                                                                        'myOrderView.Tax'
                                                                    }
                                                                    defaultMessage={
                                                                        'Tax'
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
                                                                    {data.tax}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    )}
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
                                                                        'myOrderView.GrandTotal'
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
                                                                        data.grand_total
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
                                                        'myOrderView.OrderInformation'
                                                    }
                                                    defaultMessage={
                                                        'Order PO / comments'
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
                                                <OrderPo pid={data.increment_id} />
                                            </div>
                                        </div>

                                        <div
                                            className={
                                                defaultClasses.block_title
                                            }
                                        >
                                            <strong>
                                                <FormattedMessage
                                                    id={
                                                        'myOrderView.OrderInformation'
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
                                                                            'myOrderView.ShippingAddress'
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
                                                                            'myOrderView.ShippingMethod'
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
                                                                            'myOrderView.BillingAddress'
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
                                                                    'myOrderView.PaymentMethod'
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

export default MyOrderView;

MyOrderView.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
