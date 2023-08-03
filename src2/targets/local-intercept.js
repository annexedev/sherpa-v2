const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'My Account',
                pattern: '/account/:who?',
                path: require.resolve('../components/MyAccount/account.js')
            },
            {
                name: 'My Orders',
                pattern: '/orders',
                path: require.resolve('../components/MyAccount/myOrders.js')
            },
            {
                name: 'My Wishlist',
                pattern: '/wishlist',
                path: require.resolve('../components/MyAccount/mywishlist.js')
            },
            {
                name: 'Address Book',
                pattern: '/addresses',
                path: require.resolve('../components/MyAccount/addressbook.js')
            },
            {
                name: 'My Reviews',
                pattern: '/reviews',
                path: require.resolve(
                    '../components/MyAccount/productReviews.js'
                )
            },
            {
                name: 'Newsletter Subscriptions',
                pattern: '/newsletter',
                path: require.resolve('../components/MyAccount/newsletter.js')
            },
            {
                name: 'Account Information',
                pattern: '/profile',
                path: require.resolve(
                    '../components/MyAccount/accountinformation.js'
                )
            },
            {
                name: 'Order Details',
                pattern: '/orderview/:who?',
                path: require.resolve('../components/MyAccount/myOrderView.js')
            },
            {
                name: 'New Address',
                pattern: '/address/new',
                path: require.resolve('../components/MyAccount/newAddress.js')
            },
            {
                name: 'Edit Address',
                pattern: '/address/edit/:who?',
                path: require.resolve('../components/MyAccount/editAddress.js')
            },
            {
                name: 'Print Order',
                pattern: '/printorder/:orderid?',
                path: require.resolve('../components/MyAccount/printOrder.js')
            },
            {
                name: 'Invoice',
                pattern: '/invoice/:orderid?',
                path: require.resolve('../components/MyAccount/invoice.js')
            },
            {
                name: 'Shipment',
                pattern: '/shipment/:orderid?',
                path: require.resolve('../components/MyAccount/shipments.js')
            },
            {
                name: 'Contact',
                pattern: '/contact',
                path: require.resolve('../components/ContactUs/contact.js')
            },
            {
                name: 'paypal-review',
                pattern: '/paypal-review',
                path: require.resolve(
                    '../components/CheckoutPage/paypalReview.js'
                )
            },
            {
                name: 'Refund',
                pattern: '/refunds/:orderid?',
                path: require.resolve('../components/MyAccount/refunds.js')
            },
            {
                name: 'Confirmation',
                pattern: '/customer/account/confirm',
                path: require.resolve(
                    '../components/AccountConfirmation/accountConfirmation.js'
                )
            },
            {
                name: 'Confirmation',
                pattern: '/customer/account/confirmation',
                path: require.resolve(
                    '../components/AccountConfirmation/sendConfirmationLink.js'
                )
            },
            {
                name: 'Compare Products',
                pattern: '/compare_products',
                path: require.resolve('../components/Compare/compare.js')
            }
        );
        return routes;
    });

    const targetableFactory = Targetables.using(targets);
    // Create a TargetableModule instance that points to the getOptionType.js source
    const OptionsType = targetableFactory.module(
        'src/components/ProductOptions/getOptionType.js'
    );
    const instruction = {
        after: 'const customAttributes = {',
        insert: "color: 'swatch',"
    };
    OptionsType.spliceSource(instruction);
};
