import React, { useEffect, useState, Component } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { object, shape, string } from 'prop-types';
import { useOrderConfirmationPage } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';
import SAVE_MESSAGE from '../../../queries/saveOrderComment.graphql';
import { mergeClasses } from '../../../classify';
import { Title } from '../../../components/Head';
import CreateAccount from './createAccount';
import ItemsReview from '../ItemsReview';
import defaultClasses from './orderConfirmationPage.css';

class OrderTotal extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let orderNumber = this.props.cid;
        let dataURL =
            'https://data.sherpagroupav.com/get_order.php?cid=' + orderNumber;
        console.log(dataURL);
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });
    }

    render() {
        let projectname =
            this.state.pageData.pname && this.state.pageData.pname;
        return (
            <React.Fragment>
                <b>Total: ${projectname}</b>
            </React.Fragment>
        );
    }
}

const OrderConfirmationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [messageSaved, setMessageSaved] = useState(false);

    const { data, orderNumber } = props;
    const { formatMessage } = useIntl();
    var cardMessage = localStorage.getItem('cardMessage');

    const talonProps = useOrderConfirmationPage({
        data,
        query: SAVE_MESSAGE
    });

    const { flatData, isSignedIn, SaveMessage } = talonProps;
    if (
        orderNumber &&
        cardMessage &&
        cardMessage != 'null' &&
        cardMessage != ' ' &&
        !messageSaved
    ) {
        SaveMessage({ orderNumber: orderNumber, cardMessage: cardMessage });
        setMessageSaved(true);
    }
    const {
        city,
        country,
        email,
        firstname,
        lastname,
        postcode,
        region,
        shippingMethod,
        street
    } = flatData;

    const streetRows = street.map((row, index) => {
        return (
            <span key={index} className={classes.addressStreet}>
                {row}
            </span>
        );
    });

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const createAccountForm = !isSignedIn ? (
        <CreateAccount
            firstname={firstname}
            lastname={lastname}
            email={email}
        />
    ) : null;

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${region} ${postcode} ${country}`;

    console.log(orderNumber);

    return (
        <div
            className={'container' + ' ' + classes.orderconfirmation_container}
        >
            <div className={classes.root}>
                <Title>
                    {formatMessage(
                        {
                            id: 'checkoutPage.titleReceipt',
                            defaultMessage: 'Receipt'
                        },
                        { name: STORE_NAME }
                    )}
                </Title>
                <div className={classes.mainContainer}>
                    <h2 className={classes.heading}>
                        <FormattedMessage
                            id={'checkoutPage.thankYou'}
                            defaultMessage={'Thank you for your order!'}
                        />
                    </h2>
                    <div className={classes.orderNumber}>
                        <FormattedMessage
                            id={'checkoutPage.orderNumber'}
                            defaultMessage={'Order Number'}
                        />
                        : {orderNumber}
                    </div>
                    <OrderTotal cid={orderNumber} />
                    <div className={classes.shippingInfoHeading}>
                        <FormattedMessage
                            id={'global.shippingInformation'}
                            defaultMessage={'Shipping Information'}
                        />
                    </div>
                    <div className={classes.shippingInfo}>
                        <span className={classes.email}>{email}</span>
                        <span className={classes.name}>{nameString}</span>
                        {streetRows}
                        <span className={classes.addressAdditional}>
                            {additionalAddressString}
                        </span>
                    </div>
                    <div className={classes.shippingMethodHeading}>
                        <FormattedMessage
                            id={'global.shippingMethod'}
                            defaultMessage={'Shipping Method'}
                        />
                    </div>
                    <div className={classes.shippingMethod}>
                        {shippingMethod}
                    </div>
                    <div className={classes.itemsReview}>
                        <ItemsReview data={data} />
                    </div>
                    <div className={classes.additionalText}>
                        <FormattedMessage
                            id={'checkoutPage.additionalText'}
                            defaultMessage={
                                'You will also receive an email with the details and we will let you know when your order has shipped.'
                            }
                        />
                    </div>
                </div>
                <div className={classes.sidebarContainer}>
                    {createAccountForm}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        sidebarContainer: string
    }),
    data: object.isRequired,
    orderNumber: string
};
