import React, { Suspense, useState, useEffect, Component } from 'react';
import { shape, string } from 'prop-types';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Link, resourceUrl, Redirect } from 'src/drivers';
import defaultClasses from './myAccount.css';
import wishlistClasses from './mywishlist.css';
import searchClasses from '../SearchPage/searchPage.css';
import Sidebar from './sidebar.js';
import accountClasses from './accountinformation.css';
import {
    useWishlist,
    useDeleteFromWishlist
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import WishListQuery from '../../queries/getWishlist.graphql';
import REMOVE_FROM_WISHLIST_MUTATION from '../../queries/removeFromWishlist.graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrashAlt,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useCategoryAddToCart , useProductMoreInfo } from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';

import Quantity from '../CartPage/ProductListing/quantity';

import WishlistSkelton from './WishlistSkeleton.js';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useToasts } from '@magento/peregrine';
import { FormattedMessage } from 'react-intl';
import { useGetScopeCache } from '../../peregrine/lib/talons/Home/useHome';
import ADD_SIMPLE_MUTATION from '../../queries/addSimpleProductsToCart.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
// import MpBetterWishlistGetCategories from '../../queries/getMpBetterWishlistGetCategories.graphql'
import { Title } from '@magento/venia-ui/lib/components/Head';
import { gql, useMutation } from '@apollo/client';
import { ChevronDown as ArrowDown, X as ArrowUp } from 'react-feather';
import Icon from '../Icon';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';


const Banner = React.lazy(() => import('../CedHome/banner'));
const categoryBannerIdentifierHome = 'projects_instructions';
let showCategoryBanners = true;

class ProjectName extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let cid = this.props.cid;
        let dataURL =
            'https://data.sherpagroupav.com/get_projectname.php?cid=' + cid;
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
                - <span id="widn" className={defaultClasses.nomProject}>{projectname}</span>
            </React.Fragment>
        );
    }
}

class AlreadyPurchased extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let pid = this.props.pid;
        let email = this.props.email;
        let dataURL =
            'https://data.sherpagroupav.com/get_already_purchased.php?email='+email+'&productId=' + pid;
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
        let purchased = this.state.pageData.purchased && this.state.pageData.purchased;
        let sku = this.props.sku;
        let wId = this.props.wId;
        if(this.state.pageData.purchased && this.state.pageData.purchased > 0) {
            return (
                <Link
                    className={defaultClasses.linkPurchase}
                    to={resourceUrl('/orders?project='+wId+'&id='+sku)}
                >{purchased} purchased</Link>
            );
        } else {
            return (
                <></>
            );
        }
        
    }
}

const titleIcon = <Icon src={ArrowUp} size={24} />;

const MyWishList = props => {
    //window.location.href="/";

    const { email } = useDashboard();

    const url = window.location.href;

    const myprojects = url.includes("?id");

    // console.log(myprojects);

    const [, { addToast }] = useToasts();
    const classes = mergeClasses(
        defaultClasses,
        props.classes,
        wishlistClasses
    );
    const [removeMsg, setRemoveMsg] = useState(false);
    const wishlistProps = useWishlist({
        query: WishListQuery
    });


    /* ---------------------- TAG DISCOUNT DETAILS ------------------------------- */

    // console.log(productDetails);
    // const customPricePercent = 0;

    // const final_minimum_price =
    //     (productDetails.price.minimum_price.final_price.value +
    //         customPrice +
    //         customPricePercent * productDetails.price.minimum_price.final_price.value) *
    //     1;

    // const final_regular_price =
    //     (productDetails.price.minimum_price.regular_price.value +
    //         customPrice +
    //         customPricePercent *
    //         productDetails.price.minimum_price.regular_price.value) *
    //     1;

    // const discount_percent = Math.round(
    //     (1 - final_minimum_price / final_regular_price).toFixed(2) *
    //     100 *
    //     100
    // ) / 100;

    // let discount_date = new Date(product.special_to_date);

    // // console.log(discount_percent);
    // console.log(product);
    /* -------------------------------------------------------------------------- */


    const deleteData = useDeleteFromWishlist({
        query: REMOVE_FROM_WISHLIST_MUTATION,
        customerQuery: GET_CUSTOMER_QUERY
    });
    const { handleRemoveItem, removing, removeResponse } = deleteData;
    const catProps = useCategoryAddToCart({
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY
    });
    const { handleAddToCart } = catProps;
    let productUrlSuffix = '';

    const { config } = useGetScopeCache();
    if (config.product_url_suffix && config.product_url_suffix != 'null') {
        productUrlSuffix = config.product_url_suffix;
    }
    const {
        handleSetQuantity,
        quantity,
        data,
        isSignedIn,
        loading,
        refetch
    } = wishlistProps;

// console.log(MpBetterWishlistGetCategories);
    const queryParameters = new URLSearchParams(window.location.search);

    const wId = queryParameters.get('id');

    // console.log('WID ' + wId);

    const remove = async id => {
        await handleRemoveItem({ product_id: id });
        setRemoveMsg(true);
    };

    useEffect(() => {
        if (
            removeMsg &&
            removeResponse &&
            removeResponse.removeFromWishlist &&
            removeResponse.removeFromWishlist.success
        ) {
            addToast({
                type: 'info',
                message: removeResponse.removeFromWishlist.message,
                dismissable: true,
                timeout: 10000
            });
            window.location.reload(false);
            //refetch();
        }
    }, [addToast, removeMsg, removeResponse, refetch]);

    const TOGGLE_LIKED_PHOTO = gql`
        mutation($category_name: String!) {
            MpBetterWishlistCreateCategory(
                input: { category_name: $category_name }
            ) {
                category_id
                category_name
                is_default
                items {
                    added_at
                    description
                    product_id
                    qty
                    store_id
                    wishlist_item_id
                }
            }
        }
    `;

    function AddTodo(uid) {
        let input;

        let selectId = uid;

        const [addTodo, { data, loading, error }] = useMutation(
            TOGGLE_LIKED_PHOTO
        );
        const [selectValue, setSelectValue] = React.useState('');
        if (data) {
        }
        if (loading) return 'Submitting...';
        if (error) return `Submission error! ${error.message}`;

        return (
            <>
            <div>
                <input
                    className={classes.input_rename}
                    type="text"
                    placeholder={'New project name'}
                />
                <input type="hidden" value={selectId} />
                <button
                    className={classes.rename_project}
                    onClick={e => {
                        e.preventDefault();
                        addTodo({ variables: { category_name: input.value } });
                        input.value = '';

                        window.alert('New project created.');
                        setSelectValue(999);
                        window.location.reload();
                    }}
                >
                    Create new project
                </button>
                
                {/* <MoveProjectToCart /> */}
            </div>
                <Popup
                trigger={<button className={classes.button_move_project}> Move to Cart </button>}
                modal
                nested
            >
                {close => (
                <div className="modalreact">
                    <button className="close" onClick={close}>
                    &times;
                    </button>
                    <div className="header"> Move project to cart <ProjectName cid={wId} /></div>
                    <div className="content content-align">
                    {' '}
                    This will send your entire projects contents to the Shopping Cart.
                    <br/><br/>
                    <b>Do you want to proceed?</b>
                    </div>
                    <div className="actions">
                    <button
                        className={classes.button_move_project_yes}
                        onClick={() => {
                        close();
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className={classes.button_move_project_no}
                        onClick={() => {
                        close();
                        }}
                    >
                        Cancel and close
                    </button>
                    </div>
                </div>
                )}
            </Popup>
        </>
        );
    }

    function AddTodoDuplicate(uid) {
        let input;

        let selectId = uid;

        const [addTodo, { data, loading, error }] = useMutation(
            TOGGLE_LIKED_PHOTO
        );
        const [selectValue, setSelectValue] = React.useState('');
        if (data) {
            let dataURL =
                'https://data.sherpagroupav.com/duplicate_project.php?oldProjectId=' +
                wId +
                '&projectId=' +
                data['MpBetterWishlistCreateCategory']['category_id'];
            console.log(
                'https://data.sherpagroupav.com/duplicate_project.php?projectId=' +
                data['MpBetterWishlistCreateCategory']['category_id']
            );
            fetch(dataURL)
                .then(res => res.json())
                .then(res => {
                    window.location.href =
                        '/wishlist?id=' +
                        data['MpBetterWishlistCreateCategory']['category_id'];
                });
        }
        if (loading) return 'Submitting...';
        if (error) return `Submission error! ${error.message}`;

        return (
            <div>
                <input
                    className={classes.input_rename}
                    type="text"
                    ref={node => {
                        input = node;
                    }}
                    placeholder={'New project name'}
                />
                <input type="hidden" value={selectId} />
                <button
                    className={classes.rename_project}
                    onClick={e => {
                        e.preventDefault();
                        addTodo({ variables: { category_name: input.value } });
                        input.value = '';

                        //window.alert('New project created.');
                        setSelectValue(999);
                        //window.location.reload();
                    }}
                >
                    Duplicate project
                </button>
            </div>
        );
    }

    const REMOVE_PROJECT = gql`
        mutation($category_id: String!) {
            MpBetterWishlistDeleteCategory(input: { category_id: $category_id })
        }
    `;

    function DeleteProject({ cid }) {
        const [removeProject, { data, loading, error }] = useMutation(
            REMOVE_PROJECT
        );

        if (loading)
            return (
                <button type="" className={classes.add_to_project}>
                    DELETING PROJECT
                </button>
            );
        if (error) return `Submission error! ${error.message}`;

        return (
            <div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        removeProject({ variables: { category_id: cid } });
                        window.alert('Project deleted.');
                        window.location.href = '/wishlist';
                    }}
                >
                    <button type="submit" className={classes.add_to_project}>
                        {' '}
                        Permanently Delete Project
                    </button>
                </form>
            </div>
        );
    }

    function ArchiveProject({ cid }) {
        const [archiveeProject, { data, loading, error }] = useMutation(
            RENAME_PROJECT
        );

        if (loading)
            return (
                <button type="" className={classes.add_to_project}>
                    ARCHIVING PROJECT
                </button>
            );
        if (error) return `Archive error! ${error.message}`;

        function returnVal() {
            var e = document.getElementById('widn');
            var value = e.innerHTML;
            return value;
        }

        return (
            <div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        console.log('PIN ' + returnVal());
                        archiveeProject({
                            variables: {
                                category_name: 'ARCHIVE - ' + returnVal(),
                                category_id: wId
                            }
                        });
                        window.alert('Project archived.');
                        window.location.href = '/wishlist';
                    }}
                >
                    <button type="submit" className={classes.add_to_project}>
                        {' '}
                        Archive project
                    </button>
                </form>
            </div>
        );
    }

    function MoveProjectToCart({ cid }) {
        return (
            <div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        var items = document.querySelectorAll(
                            '.activeProject .active_item' + wId
                        );
                        for (var i = 0; i < items.length; i++) {
                            items[i].click();
                        }

                        window.alert('Project added to cart.');
                    }}
                >
                    <button type="submit" className={classes.add_to_project}>
                        {' '}
                        Move Project to Cart
                    </button>
                </form>
            </div>
        );
    }

    const RENAME_PROJECT = gql`
        mutation($category_id: String!, $category_name: String!) {
            MpBetterWishlistEditCategory(
                input: {
                    category_id: $category_id
                    category_name: $category_name
                }
            ) {
                category_id
                category_name
                is_default
            }
        }
    `;

    function RenameProject({ cid }) {
        const [addTodo, { data, loading, error }] = useMutation(RENAME_PROJECT);

        if (loading)
            return (
                <button type="" className={classes.add_to_project}>
                    RENAMING PROJECT
                </button>
            );
        if (error) return `Submission error! ${error.message}`;

        function returnVal(sid) {
            var e = document.getElementById('wid' + sid);
            var value = e.value;
            return value;
        }

        return (
            <div>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addTodo({
                            variables: {
                                category_name: returnVal(wId),
                                category_id: wId
                            }
                        });
                        window.alert('Project renamed.');
                        window.location.reload(false);
                    }}
                >
                    <input
                        type="text"
                        id={'wid' + wId}
                        className={classes.input_rename}
                        placeholder={'New name'}
                    />
                    <button type="submit" className={classes.rename_project}>
                        Rename project
                    </button>
                </form>
            </div>
        );
    }

    const Select = () => {
        const [selectValue, setSelectValue] = React.useState('');
        const onChange = event => {
            const value = event.target.value;
            setSelectValue(value);
        };

        return (
            <div className={defaultClasses.wrapper_project_dropdown}>
                <select
                    onChange={onChange}
                    className={[classes.project_dropdown, defaultClasses.project_dropdown].join(' ')}
                >
                    <option value="" disabled selected hidden>Project Options</option>

                    {/* <option value="1">Create a new project</option> */}
                    <option value="5">Duplicate project</option>
                    <option value="2">Rename current project</option>
                    <option value="3">Archive current project</option>
                    <option value="4">Delete current project</option>
                </select>
                {/* {selectValue && selectValue == 1 && (
                    <div id={'hidden_div'}>
                        <AddTodo uid={wId} />
                    </div>
                )} */}
                {selectValue && selectValue == 5 && (
                    <div id={'hidden_div'}>
                        <AddTodoDuplicate uid={wId} />
                    </div>
                )}
                {selectValue && selectValue == 2 && (
                    <div id={'hidden_div'}>
                        <RenameProject cid={wId} />
                    </div>
                )}
                {selectValue && selectValue == 3 && (
                    <div id={'hidden_div'}>
                        <ArchiveProject cid={wId} />
                    </div>
                )}
                {selectValue && selectValue == 4 && (
                    <div id={'hidden_div'}>
                        <DeleteProject cid={wId} />
                    </div>
                )}
            </div>
        );
    };

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }
    if (!loading) {
        var total = 0;
        return (
            <div className={defaultClasses.columns}>
                <Title>{`My Projects`}</Title>
                {removing && (
                    <div className={accountClasses.indicator_loader}>
                        <LoadingIndicator />
                    </div>
                )}
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
                                    {myprojects &&
                                        <div
                                            className={
                                                defaultClasses.page_title_wrapper
                                            }
                                        >
                                            <div className={defaultClasses.flex_between}>
                                                <h1
                                                    className={
                                                        defaultClasses.page_title
                                                    }
                                                >
                                                    <span
                                                        className={defaultClasses.base}
                                                    >
                                                        <FormattedMessage
                                                            id={'myWishlist.page_title'}
                                                            defaultMessage={'My Projects'}
                                                        />{' '}
                                                        <ProjectName cid={wId} />
                                                    </span>
                                                </h1>
                                                <div id={'hidden_div'} className={defaultClasses.hidden_div}>
                                                    <AddTodo uid={wId} />
                                                </div>
                                            </div>
                                            <Link
                                                className={defaultClasses.btnPurchase}
                                                to={resourceUrl('/orders?project='+wId)}
                                            >Project Purchase History</Link>
                                           
                                        </div>
                                    }
                                    {wId !== undefined && wId !== null && (
                                        <>
                                            <div>
                                                Estimated total before taxes and
                                                shipping : $
                                                <span id="totalApprox" />
                                            </div>
                                            <div className={defaultClasses.wrapperBtnDropdown}>
                                            
                                                
                                                <Select />
                                            </div>
                                        </>
                                    )}
                                    <div
                                        className={
                                            defaultClasses.block_dashboard_orders +
                                            ' ' +
                                            wishlistClasses.block_dahsboard_wishlist
                                        }
                                    >
                                        {typeof data != 'undefined' && (
                                            <>
                                                <div
                                                    className={
                                                        classes.products_wrapper
                                                    }
                                                >
                                                    {data.map((val, index) => {
                                                        var currentProduct =
                                                            val.product;
                                                        console.log(val);
                                                        function belongToProject(
                                                            pid,
                                                            cid
                                                        ) {
                                                            let dataURL =
                                                                'https://data.sherpagroupav.com/get_belongs.php?pid=' +
                                                                pid +
                                                                '&cid=' +
                                                                cid;
                                                            fetch(dataURL)
                                                                .then(res =>
                                                                    res.json()
                                                                )
                                                                .then(res => {
                                                                    if (
                                                                        res.display ==
                                                                        1
                                                                    ) {
                                                                        //document.getElementById('.q'+val.id+' #quantity').value=val.qty;
                                                                        //var targetDiv = getElementsByClassName('q'+val.id).document.getElementById("quantity")[0];
                                                                        //targetDiv.value = val.qty;
                                                                        //document.getElementById('q'+val.id).getElementById("quantity")[0].value = 8;
                                                                        document.getElementById(
                                                                            't' +
                                                                                pid
                                                                        ).style.display =
                                                                            'block';
                                                                        var element = document.getElementById(
                                                                            't' +
                                                                                pid
                                                                        );
                                                                        element.classList.add(
                                                                            'activeProject'
                                                                        );
                                                                        console.log(
                                                                            'Is active' +
                                                                                val.product.price.regularPrice.amount.value.toFixed(
                                                                                    2
                                                                                )
                                                                        );
                                                                        total =
                                                                            total +
                                                                            Number(
                                                                                val.product.price.regularPrice.amount.value.toFixed(
                                                                                    2
                                                                                ) *
                                                                                    val.qty
                                                                            );
                                                                        console.log(
                                                                            'Total : ' +
                                                                                total
                                                                        );
                                                                        document.getElementById(
                                                                            'totalApprox'
                                                                        ).innerHTML = total.toFixed(
                                                                            2
                                                                        );
                                                                    } else {
                                                                    }
                                                                });

                                                            return 1;
                                                        }

                                                        if (
                                                            belongToProject(
                                                                val.product.id,
                                                                wId
                                                            )
                                                        ) {

                                                            var discount_percent =
                                                                Math.round(
                                                                    (1 - val.product.final_minimum_price / val.product.final_regular_price).toFixed(2) *
                                                                        100 *
                                                                        100
                                                                ) / 100;

                                                            return (
                                                                <>
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={
                                                                            classes.product_tiles
                                                                        }
                                                                        id={
                                                                            't' +
                                                                            val
                                                                                .product
                                                                                .id
                                                                        }
                                                                    >
                                                                        {/* --------- ICI le green pills ------- */}
                                                                        
                                                                        {discount_percent > 0 && email && (
                                                                            <div className={classes.priceTag}>
                                                                                <b>
                                                                                    {discount_percent}%{' '}
                                                                                    <FormattedMessage
                                                                                        id={'item.rebate'}
                                                                                        defaultMessage={'Off'}
                                                                                    />
                                                                                    {val.product.special_to_date && (
                                                                                        <>
                                                                                            {' '}
                                                                                            <FormattedMessage
                                                                                                id={'item.until'}
                                                                                                defaultMessage={'until'}
                                                                                            />{' '}
                                                                                            {discount_date
                                                                                                .toDateString()
                                                                                                .split(' ')
                                                                                                .slice(1)
                                                                                                .join(' ')}
                                                                                        </>
                                                                                    )}
                                                                                </b>
                                                                            </div>
                                                                        )}

                                                                        <div
                                                                            className={
                                                                                classes.inner
                                                                            }
                                                                        >
                                                                            <div
                                                                                className={
                                                                                    classes.product_img
                                                                                }
                                                                            >
                                                                                <Link
                                                                                    to={resourceUrl(
                                                                                        val
                                                                                            .product[
                                                                                        'url_key'
                                                                                        ] +
                                                                                        productUrlSuffix
                                                                                    )}
                                                                                >
                                                                                    <img
                                                                                        src={
                                                                                            val
                                                                                                .product
                                                                                                .small_image
                                                                                                .url
                                                                                        }
                                                                                        alt="smallimage"
                                                                                        className={
                                                                                            'img-fluid'
                                                                                        }
                                                                                    />
                                                                                </Link>
                                                                            </div>

                                                                            <div
                                                                                className={
                                                                                    classes.product_details
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        classes.product_name
                                                                                    }
                                                                                >
                                                                                    <Link
                                                                                        to={resourceUrl(
                                                                                            val
                                                                                                .product[
                                                                                            'url_key'
                                                                                            ] +
                                                                                            productUrlSuffix
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            val
                                                                                                .product
                                                                                                .name
                                                                                        }
                                                                                    </Link>
                                                                                    <b>
                                                                                        <FormattedMessage
                                                                                            id={
                                                                                                'item.partNo'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Part #'
                                                                                            }
                                                                                        />
                                                                                    </b>{' '}
                                                                                    {
                                                                                        val
                                                                                            .product
                                                                                            .sku
                                                                                    }
                                                                                </div>
                                                                                <span
                                                                                    className={
                                                                                        classes.price_label
                                                                                    }
                                                                                >
                                                                                    ${' '}
                                                                                </span>
                                                                                <span
                                                                                    className={
                                                                                        classes.price
                                                                                    }
                                                                                >
                                                                                    {val.product.price.regularPrice.amount.value.toFixed(
                                                                                        2
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <div
                                                                                id={
                                                                                    'q' +
                                                                                    val.id
                                                                                }
                                                                                className={
                                                                                    classes.wishlist_quantity
                                                                                }
                                                                            >
                                                                                <Quantity
                                                                                    initialValue={
                                                                                        val.qty
                                                                                    }
                                                                                    onValueChange={value =>
                                                                                        handleSetQuantity(
                                                                                            value,
                                                                                            val
                                                                                                .product
                                                                                                .sku
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <span
                                                                                    className={
                                                                                        classes.delete_icon
                                                                                    }
                                                                                >
                                                                                    <button
                                                                                        id={
                                                                                            val
                                                                                                .product
                                                                                                .id
                                                                                        }
                                                                                        onClick={() =>
                                                                                            remove(
                                                                                                val
                                                                                                    .product
                                                                                                    .id
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <span
                                                                                            className={
                                                                                                classes.delete_text
                                                                                            }
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={
                                                                                                    faTrashAlt
                                                                                                }
                                                                                            />
                                                                                        </span>
                                                                                    </button>
                                                                                </span>
                                                                                
                                                                            </div>
                                                                            <AlreadyPurchased wId={wId} sku={val.product.sku} pid={val.product.id} email={email} />
                                                                            <div
                                                                                className={
                                                                                    classes.actions_wrapper
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        classes.add_btn_wrap
                                                                                    }
                                                                                >
                                                                                    {val
                                                                                        .product
                                                                                        .__typename ==
                                                                                        'SimpleProduct' && (
                                                                                            <>
                                                                                            <button
                                                                                                className={
                                                                                                    'active_item' +
                                                                                                    wId
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    /*handleAddToCart(
                                                                                                val.product, val.qty
                                                                                            );*/
                                                                                                    var currentQty = document
                                                                                                        .querySelector(
                                                                                                            '#q' +
                                                                                                            val.id
                                                                                                        )
                                                                                                        .querySelector(
                                                                                                            'input'
                                                                                                        )
                                                                                                        .value;
                                                                                                    console.log(
                                                                                                        'qqqw'
                                                                                                    );
                                                                                                    console.log(
                                                                                                        val.product
                                                                                                    );
                                                                                                    let item =
                                                                                                        val.product;

                                                                                                    for (
                                                                                                        let i = 0;
                                                                                                        i <
                                                                                                        currentQty;
                                                                                                        i++
                                                                                                    ) {
                                                                                                        handleAddToCart(
                                                                                                            val.product
                                                                                                        );
                                                                                                    }

                                                                                                    //window.alert("Product moved to cart.");
                                                                                                    /*remove(
                                                                                                val
                                                                                                    .product
                                                                                                    .id
                                                                                            );*/
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    className={
                                                                                                        classes.add_btn
                                                                                                    }
                                                                                                >
                                                                                                    <FormattedMessage
                                                                                                        id={
                                                                                                            'myWishlist.moveToCartBtn'
                                                                                                        }
                                                                                                        defaultMessage={
                                                                                                            'Move to cart'
                                                                                                        }
                                                                                                    />
                                                                                                </span>
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    document.getElementById('move_item_box_'+val.id).style.display='block';
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    className={
                                                                                                        classes.move_item
                                                                                                    }
                                                                                                >
                                                                                                    <FormattedMessage
                                                                                                        id={
                                                                                                            'myWishlist.moveToCartBtnPartial'
                                                                                                        }
                                                                                                        defaultMessage={
                                                                                                            'Move partial quantity to cart'
                                                                                                        }
                                                                                                    />
                                                                                                </span>
                                                                                            </button>
                                                                                            <div 
                                                                                                id={'move_item_box_'+val.id} 
                                                                                                className={ classes.move_item_static }>
                                                                                                <Quantity
                                                                                                    initialValue={1}
                                                                                                />
                                                                                                <button
                                                                                                onClick={() => {
                                                                                                    document.getElementById('move_item_box_'+val.id).style.display='block';
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    className={
                                                                                                        classes.move_confirm
                                                                                                    }
                                                                                                >
                                                                                                    <FormattedMessage
                                                                                                        id={
                                                                                                            'myWishlist.moveConfirm'
                                                                                                        }
                                                                                                        defaultMessage={
                                                                                                            'Confirm'
                                                                                                        }
                                                                                                    />
                                                                                                </span>
                                                                                            </button>
                                                                                            </div>
                                                                                            </>
                                                                                        )}
                                                                                    {val
                                                                                        .product
                                                                                        .__typename !=
                                                                                        'SimpleProduct' && (
                                                                                            <>
                                                                                            <Link
                                                                                                to={resourceUrl(
                                                                                                    val
                                                                                                        .product[
                                                                                                    'url_key'
                                                                                                    ] +
                                                                                                    productUrlSuffix
                                                                                                )}
                                                                                                className={
                                                                                                    classes.add_btn
                                                                                                }
                                                                                            >
                                                                                                <FormattedMessage
                                                                                                    id={
                                                                                                        'myWishlist.moveToCartBtn'
                                                                                                    }
                                                                                                    defaultMessage={
                                                                                                        'Move to cart'
                                                                                                    }
                                                                                                />
                                                                                            </Link>
                                                                                            <Link
                                                                                                to={resourceUrl(
                                                                                                    val
                                                                                                        .product[
                                                                                                    'url_key'
                                                                                                    ] +
                                                                                                    productUrlSuffix
                                                                                                )}
                                                                                                className={
                                                                                                    classes.add_btn
                                                                                                }
                                                                                            >
                                                                                                <FormattedMessage
                                                                                                    id={
                                                                                                        'myWishlist.moveToCartBtn'
                                                                                                    }
                                                                                                    defaultMessage={
                                                                                                        'Move to cart'
                                                                                                    }
                                                                                                />
                                                                                            </Link>
                                                                                            </>
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        } else {
                                                            return <></>;
                                                        }
                                                    })}
                                                    {data.length == 0 && (
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
                                                                        'myWishlist.noResult_text'
                                                                    }
                                                                    defaultMessage={
                                                                        'You have no items saved in wishlist.'
                                                                    }
                                                                />
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {typeof data == 'undefined' && (
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
                                                            'myWishlist.noResult_text'
                                                        }
                                                        defaultMessage={
                                                            'You have no items saved in wishlist.'
                                                        }
                                                    />
                                                </span>
                                            </div>
                                        )}

                                        {wId == undefined && (
                                            <>
                                                <Suspense fallback={''}>
                                                    <Banner
                                                        identifier={
                                                            categoryBannerIdentifierHome
                                                        }
                                                        showBanner={
                                                            showCategoryBanners
                                                        }
                                                    />
                                                </Suspense>
                                                <AddTodo uid={wId} />
                                            </>
                                        )}
                                    </div>
                                    {/* {wId !== undefined && wId !== null && (
                                        <>
                                            <Select uid={wId} />
                                        </>
                                    )} */}
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
                <Title>{`My Projects - ${STORE_NAME}`}</Title>
                {removing && (
                    <div className={accountClasses.indicator_loader}>
                        <LoadingIndicator />
                    </div>
                )}
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
                                                    id={'myWishlist.page_title'}
                                                    defaultMessage={
                                                        'My Projects (loading)'
                                                    }
                                                />
                                            </span>
                                        </h1>
                                    </div>
                                    <div>
                                        <WishlistSkelton />
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

export default MyWishList;

MyWishList.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
