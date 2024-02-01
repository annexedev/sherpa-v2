const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'My Account',
                pattern: '/account/:who?',
                path: 'src/components/MyAccount/account.js'
            },
            {
                name: 'My Orders',
                pattern: '/orders',
                path: 'src/components/MyAccount/myOrders.js'
            },
            {
                name: 'My Wishlist',
                pattern: '/wishlist',
                path: 'src/components/MyAccount/mywishlist.js'
            },
            {
                name: 'My Wishlist',
                pattern: '/myprojects',
                path: require.resolve('../components/MyAccount/mywishlist.js')
            },
            {
                name: 'Address Book',
                pattern: '/addresses',
                path: 'src/components/MyAccount/addressbook.js'
            },
            {
                name: 'My Reviews',
                pattern: '/reviews',
                path: 'src/components/MyAccount/productReviews.js'
            },
            {
                name: 'Newsletter Subscriptions',
                pattern: '/newsletter',
                path: 'src/components/MyAccount/newsletter.js'
            },
            {
                name: 'Account Information',
                pattern: '/profile',
                path: 'src/components/MyAccount/accountinformation.js'
            },
            {
                name: 'Order Details',
                pattern: '/orderview/:who?',
                path: 'src/components/MyAccount/myOrderView.js'
            },
            {
                name: 'New Address',
                pattern: '/address/new',
                path: 'src/components/MyAccount/newAddress.js'
            },
            {
                name: 'Edit Address',
                pattern: '/address/edit/:who?',
                path: 'src/components/MyAccount/editAddress.js'
            },
            {
                name: 'Print Order',
                pattern: '/printorder/:orderid?',
                path: 'src/components/MyAccount/printOrder.js'
            },
            {
                name: 'Invoice',
                pattern: '/invoice/:orderid?',
                path: 'src/components/MyAccount/invoice.js'
            },
            {
                name: 'Shipment',
                pattern: '/shipment/:orderid?',
                path: 'src/components/MyAccount/shipments.js'
            },
            {
                name: 'Contact',
                pattern: '/contact',
                path: 'src/components/ContactUs/contact.js'
            },
            {
                name: 'paypal-review',
                pattern: '/paypal-review',
                path: 'src/components/CheckoutPage/paypalReview.js'
            },
            {
                name: 'Refund',
                pattern: '/refunds/:orderid?',
                path: 'src/components/MyAccount/refunds.js'
            },
            {
                name: 'Confirmation',
                pattern: '/customer/account/confirm',
                path: 'src/components/AccountConfirmation/accountConfirmation.js'
            },
            {
                name: 'Confirmation',
                pattern: '/customer/account/confirmation',
                path: 'src/components/AccountConfirmation/sendConfirmationLink.js'
            },
            {
                name: 'Compare Products',
                pattern: '/compare_products',
                path: 'src/components/Compare/compare.js'
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
