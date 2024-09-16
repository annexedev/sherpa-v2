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
import { Util } from '@magento/peregrine';
import {
    useWishlist,
    useDeleteFromWishlist
} from '../../peregrine/lib/talons/MyAccount/useDashboard';
import WishListQuery from '../../queries/getWishlist.graphql';
import REMOVE_FROM_WISHLIST_MUTATION from '../../queries/removeFromWishlist.graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTrashAlt,
    faExclamationTriangle,
    faChevronDown,
    faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { useCategoryAddToCart, useProductMoreInfo } from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';

import Quantity from '../CartPage/ProductListing/quantity';
import { useCartPage } from '../../peregrine/lib/talons/CartPage/useCartPage.js';
import WishlistSkelton from './WishlistSkeleton.js';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useToasts } from '@magento/peregrine';
import { FormattedMessage } from 'react-intl';
import { useGetScopeCache } from '../../peregrine/lib/talons/Home/useHome';
import ADD_SIMPLE_MUTATION from '../../queries/addSimpleProductsToCart.graphql';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import { GET_CART_DETAILS } from '../CartPage/cartPage.gql';
// import MpBetterWishlistGetCategories from '../../queries/getMpBetterWishlistGetCategories.graphql'
import { Title } from '@magento/venia-ui/lib/components/Head';
import { gql, useMutation } from '@apollo/client';
import { ChevronDown as ArrowDown, X as ArrowUp } from 'react-feather';
import Icon from '../Icon';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { Price } from '@magento/peregrine';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';

const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

const Banner = React.lazy(() => import('../CedHome/banner'));
let categoryBannerIdentifierHome = 'projects_instructions';
let categoryBannerIdentifierHomeBanner = 'projects_instructions_banner';
let showCategoryBanners = true;
let projectname = '';
let purchasedProduct = [];
let realQty = 0;
let checkedSwitchButton;

class SpecialPriceTo extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let pid = this.props.pid;
        let lng = '';
        if (document.getElementById('currentLng') != null) {
            lng = document.getElementById('currentLng').innerHTML;
        }
        let activeLng = '';
        if (lng == 'Français') {
            activeLng = 'fr';
        } else {
            activeLng = 'en';
        }

        let dataURL = 'https://data.sherpagroupav.com/get_specialproject.php?pid=' + pid + '&lng=' + activeLng;

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });
    }

    render() {
        let content = this.state.pageData.content && this.state.pageData.content;
        if (content && content != '') {
            return (
                <div className={defaultClasses.priceTag}>
                    <b>
                        {content}
                    </b>
                </div>

            );
        } else {
            return (<></>);
        }
    }
}
class TotalProjet extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }


    componentDidMount() {
        let cid = this.props.cid;
        console.log(cid);
        let dataURL = 'https://data.sherpagroupav.com/get_projecttotal.php?cid=' + cid;
        // console.log(dataURL);
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({
                    pageData: res
                });
            });

    }

    render() {
        let itemCount = this.state.pageData.itemCount;
        let priceTotal = this.state.pageData.priceTotal;




        if (itemCount && itemCount > 0) {
            return (
                <>
                    <div className={defaultClasses.blocQntProduits}>{itemCount} <FormattedMessage id={'project.products'} defaultMessage={'Products'} /> &nbsp;&nbsp;<b><Price currencyCode={'CAD'} value={priceTotal} /></b></div>
                </>

            );
        } else if (itemCount == 0) {
            return (
                <>
                    <div className={defaultClasses.blocQntProduits}><FormattedMessage id={'project.noItems'} defaultMessage={'No items in your project!'} /></div>
                </>
            );
        }

        else {
            return (<><div className={defaultClasses.blocQntProduits}>Calculating ...</div></>);
        }

    }
}
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
        projectname = this.state.pageData.pname && this.state.pageData.pname;

        return (
            <React.Fragment>
                - <span id="widn" className={defaultClasses.nomProject}>{projectname}</span>
            </React.Fragment>
        );
    }
}
class ToggleAccess extends Component {

    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }



    componentDidMount() {
        let email = this.props.email;
        let dataURL =
            'https://data.sherpagroupav.com/get_projectaccess.php?email=' + email;

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });
    }

    render() {

        function AddTodo(uid) {
            let input;
            let selectId = uid;

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
                            qty
                            store_id
                            wishlist_item_id
                        }
                    }
                }
            `;

            const [addTodo, { data, loading, error }] = useMutation(
                TOGGLE_LIKED_PHOTO
            );

            // console.log(data);
            const [selectValue, setSelectValue] = React.useState('');

            const { BrowserPersistence } = Util;
            const storage = new BrowserPersistence();
            let storeview = storage.getItem('store_view_code');
            if (!storeview) {
                storeview = '';
            }

            if (data) {
                const category_id = data.MpBetterWishlistCreateCategory.category_id;
                /* ici a la place do reload mettre une redirection vers le id de projet crée  --- /myprojects?id=1712842224_452 */
                window.location.href = `/myprojects?id=${category_id}`;
            }
            if (loading) return 'Submitting...';
            if (error) return `Submission error! ${error.message}`;
            /*if (1) {
                return (<>s</>);
            } else { */
            return (<>

                <div className={classes.new_project}>
                    <input
                        className={classes.input_rename}
                        type="text"
                        ref={node => {
                            input = node;
                        }}
                        placeholder={storeview === 'fr' ? 'Entrez le nom du projet' : 'Enter project name'}
                    />
                    <input type="hidden" value={selectId} />
                    <button
                        className={classes.rename_project}
                        onClick={e => {
                            e.preventDefault();
                            addTodo({ variables: { category_name: input.value } });
                            input.value = '';
                            console.log(data);

                            if (storeview === 'fr') {
                                window.alert('Nouveau projet créé.');
                            }
                            else {
                                window.alert('New project created.');
                                // window.location.href = `/myprojects?id=${selectId}`;
                            }
                            // window.alert('New project created.');
                            setSelectValue(999);
                        }}
                    >
                        {storeview === 'fr' ? 'Créer un nouveau projet' : 'Create new project'}
                    </button>
                </div>

            </>);
            //}
        }

        let email = this.props.email;
        let wid = this.props.wid;

        const classes = mergeClasses(
            defaultClasses, wishlistClasses
        );

        const handleSwitch = async () => {

            var checkedStatus = document.getElementById('switchBTN');
            checkedSwitchButton = document.getElementById('switchBTN');

            if (checkedStatus.checked === true) {
                await fetch(`https://data.sherpagroupav.com/set_projectaccess.php?email=${email}&status=1`)
                    .then(res => res.json())
                    .then(res => {
                        document.getElementById('switchBTN').checked = false;

                        if (res) {
                            window.location.reload();
                        }
                    });

            } else if (checkedStatus.checked === false) {
                await fetch(`https://data.sherpagroupav.com/set_projectaccess.php?email=${email}&status=0`)
                    .then(res => res.json())
                    .then(res => {
                        document.getElementById('switchBTN').checked = true;

                        if (res) {
                            window.location.reload();
                        }
                    });
            }
        }

        let result = this.state.pageData.access && this.state.pageData.access;
        // access = this.state.pageData.access && this.state.pageData.access;

        if (result == 1) {
            return (
                <>
                    <div className={classes.wrapperSwitchBtn}>
                        <h4>
                            <FormattedMessage id={'myWishlist.labelSwitchActivate'} defaultMessage={'Activate'} />
                        </h4>
                        <div className={classes.switch} onClick={handleSwitch} >
                            <input type="checkbox" id="switchBTN" ></input>
                            <span className={[classes.slider, classes.round].join(' ')}></span>
                        </div>
                        <h4>
                            <FormattedMessage id={'myWishlist.labelSwitchDeactivate'} defaultMessage={'Deactivate'} />
                            <span>
                                &nbsp;<FormattedMessage id={'myWishlist.labelSwitchDeactivateMessage'} defaultMessage={'(project contents are preserved, not deleted)'} />
                            </span>
                        </h4>

                    </div>
                    <div>
                        <p className={classes.wrapperSwitchBtnMessage}>
                            <span>
                                &nbsp;<FormattedMessage id={'myWishlist.labelSwitchDeactivateMessage'} defaultMessage={'(project contents are preserved, not deleted)'} />
                            </span>
                        </p>
                    </div>
                    <AddTodo wid={wid} />
                </>
            )
        } else if (result == 0) {
            return (
                <>
                    <div className={classes.wrapperSwitchBtn}>
                        <h4>
                            <FormattedMessage id={'myWishlist.labelSwitchActivate'} defaultMessage={'Activate'} />
                        </h4>
                        <div className={classes.switch} onClick={handleSwitch} >
                            <input type="checkbox" id="switchBTN" checked></input>
                            <span className={[classes.slider, classes.round].join(' ')}></span>
                        </div>
                        <h4>
                            <FormattedMessage id={'myWishlist.labelSwitchDeactivate'} defaultMessage={'Deactivate'} />
                            <span>
                                &nbsp;<FormattedMessage id={'myWishlist.labelSwitchDeactivateMessage'} defaultMessage={'(project contents are preserved, not deleted)'} />
                            </span>
                        </h4>
                    </div>
                    <div>
                        <p className={classes.wrapperSwitchBtnMessage}>
                            <span>
                                &nbsp;<FormattedMessage id={'myWishlist.labelSwitchDeactivateMessage'} defaultMessage={'(project contents are preserved, not deleted)'} />
                            </span>
                        </p>
                    </div>
                </>
            );
        } else {
            return (<></>);
        }
    }

}
class BrandName extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let productId = this.props.pid;
        let dataURL =
            'https://data.sherpagroupav.com/get_brandname.php?pid=' + productId;

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });
    }

    render() {
        // console.log('UPDATED');
        let brandname = this.state.pageData.brandname && this.state.pageData.brandname;
        if (brandname) {
            return (
                <p className={defaultClasses.product_brand_name}>{brandname}</p>
            )
        } else {
            return (<p className={defaultClasses.product_brand_name}>&nbsp;</p>);
        }
    }
}
class IsInCart extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    /*async componentDidMount() {

        let productId = this.props.pid;
        let email = this.props.email;
        let cid = this.props.cid;

        const url = 'https://data.sherpagroupav.com/get_projectsitemincart.php?pid='+productId+'&email='+email+'&cid=' + cid;

        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw Error(response.statusText);
          }
          const json = await response.json();
          console.log(json)
          this.setState({ pageData: res });
        } catch(error) {
          console.log(error)
        }
      }*/

    componentDidMount() {

        let productId = this.props.pid;
        let email = this.props.email;
        let cid = this.props.cid;
        let dataURL = 'https://data.sherpagroupav.com/get_projectsitemincart.php?pid=' + productId + '&email=' + email + '&cid=' + cid;

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });


    }

    render() {
        let additional_data = this.state.pageData.additional_data && this.state.pageData.additional_data;
        if (additional_data && additional_data != 'undefined' && additional_data >= 0) {
            return (
                <>
                    <div className={defaultClasses.ribbon_wrapper}>
                        <div className={defaultClasses.ribbon}>{additional_data} <FormattedMessage id={'project.incart'} defaultMessage={'in cart'} /> </div>
                    </div>
                </>
            );
        } else {
            return (<></>);
        }
    }
}
class SpecialPrice extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let productId = this.props.productId;

        let dataURL = 'https://data.sherpagroupav.com/get_newfromandto_project.php?pid=' + productId;
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
        let regularPrice = this.props.regularPrice;
        let special_price = this.state.pageData.special_price && this.state.pageData.special_price;
        if (special_price > 0) {
            return (
                <>
                    <span
                        className={
                            defaultClasses.productPrice +
                            ' ' +
                            defaultClasses.greenprice
                        }
                    >
                        <span className={defaultClasses.yourcost}>
                            <FormattedMessage
                                id={'item.yourCost'}
                                defaultMessage={'YOUR COST'}
                            />
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <Price
                            currencyCode={'CAD'}
                            value={special_price}
                        />
                    </span>
                    <span
                        className={
                            defaultClasses.productPrice +
                            ' ' +
                            defaultClasses.regularprice +
                            ' ' +
                            defaultClasses.discountedprice
                        }
                    >
                        <Price
                            currencyCode={'CAD'}
                            value={regularPrice}
                        />
                    </span>
                </>
            )
        } else {
            return (
                <>
                    <span
                        className={
                            defaultClasses.productPrice
                        }
                    >
                        <span className={defaultClasses.yourcost}>
                            <FormattedMessage
                                id={'item.yourCost'}
                                defaultMessage={'YOUR COST'}
                            />
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <Price
                            currencyCode={'CAD'}
                            value={regularPrice}
                        />
                    </span>
                </>);
        }
    }
}
class SoldIn extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {

        let lng = '';
        if (document.getElementById('currentLng') != null) {
            lng = document.getElementById('currentLng').innerHTML;
        }
        let activeLng = '';
        if (lng == 'Français') {
            activeLng = 2;
        } else {
            activeLng = 0;
        }

        let productId = this.props.pid;

        let dataURL =
            'https://data.sherpagroupav.com/get_soldin.php?pid=' + productId + '&sid=' + activeLng;

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });
    }

    render() {
        let soldin = this.state.pageData.soldin && this.state.pageData.soldin;
        if (soldin) {
            return (
                <p className={defaultClasses.product_brand_name}>
                    <b>
                        <FormattedMessage
                            id={'item.partNo'}
                            defaultMessage={'Sold in: '}
                        />
                    </b>
                    {soldin}</p>
            )
        } else {
            return (<></>);
        }
    }
}
class RealQuantity extends Component {

    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }


    componentDidMount() {
        let cid = this.props.cid;
        let pid = this.props.pid;
        let dataURL = 'https://data.sherpagroupav.com/get_belongs.php?pid=' + pid + '&cid=' + cid;
        // console.log(dataURL);

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });

    }

    render() {
        let qty = this.state.pageData.qty && this.state.pageData.qty;
        let wid = this.props.wid;
        let pid = this.props.pid;
        let cid = this.props.cid;
        realQty = qty;
        return (
            <>
                <Quantity
                    // initialValue={1}
                    min={1}
                    wid={cid}
                    productId={wid}
                    initialValue={qty}
                />
            </>

        );
    }
}
class AlreadyPurchased extends Component {
    constructor() {
        super();
        this.state = {
            pageData: [],
            pageData2: []
        };
    }

    componentDidMount() {
        let pid = this.props.pid;
        let email = this.props.email;
        let projectId = this.props.wId;
        let dataURL =
            'https://data.sherpagroupav.com/get_already_purchased.php?email=' + email + '&productId=' + pid + '&projectId=' + projectId;
        // console.log(dataURL);

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
        if (this.state.pageData.purchased && this.state.pageData.purchased > 0) {
            //purchasedProduct = this.state.pageData.purchased;
            return (
                <Link
                    className={defaultClasses.linkPurchase}
                    to={resourceUrl('/orders?project=' + wId + '&id=' + sku)}
                >
                    {purchased}
                    <FormattedMessage id={'myWishlist.labelPurchased'} defaultMessage={' purchased'} />
                </Link>
            );
        } else {
            return (
                <div></div>
            );
        }

    }
}
class RemainProject extends Component {
    constructor() {
        super();
        this.state = {
            pageData: [],
            pageData2: []
        };
    }

    componentDidMount() {
        let pid = this.props.pid;
        let wId = this.props.wId;
        let email = this.props.email;
        let projectId = this.props.wId;
        let dataURL = 'https://data.sherpagroupav.com/get_already_purchased.php?email=' + email + '&productId=' + pid + '&projectId=' + projectId;
        // console.log(dataURL);

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData: res
                });
            });

        let dataURL2 = 'https://data.sherpagroupav.com/get_belongs.php?pid=' + pid + '&cid=' + wId;

        fetch(dataURL2)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageData2: res
                });
            });
    }

    render() {

        let qty = this.state.pageData2.qty && this.state.pageData2.qty;
        if (this.state.pageData.purchased && this.state.pageData2.qty > 0) {
            const purchased = {
                pid: this.props.pid,
                qty: this.state.pageData.purchased
            };
            purchasedProduct.push(purchased);
            return (
                <div className={defaultClasses.linkPurchase}>
                    {qty - purchased.qty}
                    <FormattedMessage
                        id={
                            'myWishlist.remainToPurchase'
                        }
                        defaultMessage={
                            'remain(s) to purchase'
                        }
                    />
                </div>

            );
        } else {
            return (
                <div></div>
            );
        }

    }
}
// class TableProjects extends Component {
//     constructor() {
//         super();
//         this.state = {
//             pageData: [],
//             sortColumn: '',
//             pageDataAccess: [],
//             sortDirection: 'asc' // 'asc' para ascendente, 'desc' para descendente
//         };
//     }

//     componentDidMount() {
//         let email = this.props.email;
//         let dataURL = 'https://data.sherpagroupav.com/get_projects_details.php?email=' + email;

//         fetch(dataURL)
//             .then(res => res.json())
//             .then(res => {
//                 this.setState({ pageData: res });
//             });

//         let grantAccess =
//             'https://data.sherpagroupav.com/get_projectaccess.php?email=' + email;
//         fetch(grantAccess)
//             .then(res => res.json())
//             .then(res => {
//                 this.setState({
//                     pageDataAccess: res
//                 });
//             });


//     }

//     handleSort = (column) => {
//         const { sortColumn, sortDirection, pageData } = this.state;
//         let newDirection = 'desc';

//         if (sortColumn === column && sortDirection === 'desc') {
//             newDirection = 'asc';
//         }

//         const sortedData = [...pageData].sort((a, b) => {
//             const aValue = a[column];
//             const bValue = b[column];

//             const isANumber = !isNaN(aValue);
//             const isBNumber = !isNaN(bValue);

//             if (isANumber && isBNumber) {
//                 return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
//             } else {
//                 const aStr = aValue ? aValue.toString().toLowerCase() : '';
//                 const bStr = bValue ? bValue.toString().toLowerCase() : '';

//                 if (aStr < bStr) return newDirection === 'asc' ? -1 : 1;
//                 if (aStr > bStr) return newDirection === 'asc' ? 1 : -1;
//                 return 0;
//             }
//         });

//         this.setState({
//             pageData: sortedData,
//             sortColumn: column,
//             sortDirection: newDirection
//         });
//     };


//     render() {
//         const { pageData, sortColumn, sortDirection } = this.state;

//         console.log(this.state.pageData);

//         if (pageData && pageData.length > 0 && this.state.pageDataAccess['access'] == 1) {
//             return (
//                 <div className={wishlistClasses.tableWrap}>
//                     <table className={wishlistClasses.sortable}>
//                         <thead>
//                             <tr>
//                                 <th onClick={() => this.handleSort('projectName')}>
//                                     <span>
//                                         <FormattedMessage id={'myWishlist.project_name'} defaultMessage={'Project name'} />
//                                         <FontAwesomeIcon
//                                             icon={
//                                                 faChevronDown
//                                             }
//                                             className={wishlistClasses.chevronDown}
//                                         />
//                                     </span>
//                                     <span className={wishlistClasses[sortColumn === 'projectName' ? sortDirection : '']}></span>
//                                 </th>
//                                 <th onClick={() => this.handleSort('dateCreation')}>
//                                     <span>
//                                         <FormattedMessage id={'myWishlist.project_date_creation'} defaultMessage={'Creation date'} />
//                                         <FontAwesomeIcon
//                                             icon={
//                                                 faChevronDown
//                                             }
//                                             className={wishlistClasses.chevronDown}
//                                         />
//                                     </span>
//                                     <span className={wishlistClasses[sortColumn === 'dateCreation' ? sortDirection : '']}></span>
//                                 </th>
//                                 <th onClick={() => this.handleSort('numberProducts')}>
//                                     <span>
//                                         <FormattedMessage id={'myWishlist.project_n_produits'} defaultMessage={'N. produits'} />
//                                         <FontAwesomeIcon
//                                             icon={
//                                                 faChevronDown
//                                             }
//                                             className={wishlistClasses.chevronDown}
//                                         />
//                                     </span>
//                                     <span className={wishlistClasses[sortColumn === 'numberProducts' ? sortDirection : '']}></span>
//                                 </th>
//                                 <th onClick={() => this.handleSort('total')}>
//                                     <span>
//                                         <FormattedMessage id={'myWishlist.project_total'} defaultMessage={'Total estimé'} />
//                                         <FontAwesomeIcon
//                                             icon={
//                                                 faChevronDown
//                                             }
//                                             className={wishlistClasses.chevronDown}
//                                         />
//                                     </span>
//                                     <span className={wishlistClasses[sortColumn === 'total' ? sortDirection : '']}></span>
//                                 </th>
//                                 {/* <th onClick={() => this.handleSort('total')}>
//                                     <span>
//                                         <FormattedMessage id={'myWishlist.project_still_purchase'} defaultMessage={'Still to purchase'} />
//                                         <FontAwesomeIcon
//                                             icon={
//                                                 faChevronDown
//                                             }
//                                             className={wishlistClasses.chevronDown}
//                                         />
//                                     </span>
//                                     <span className={wishlistClasses[sortColumn === 'total' ? sortDirection : '']}></span>
//                                 </th> */}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {pageData.map((project) => (
//                                 <tr key={project.id}>
//                                     <td><a href={'myprojects?id=' + project.id}>{project.projectName}</a></td>
//                                     <td>{project.dateCreation === null ? 'N/A' : project.dateCreation}</td>
//                                     <td>{project.numberProducts}</td>
//                                     <td className={wishlistClasses.num}>${project.total}</td>
//                                     {/* <td className={wishlistClasses.num}>$still</td> */}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             );
//         } else {
//             return <div></div>;
//         }
//     }
// }
class TableProjects extends Component {
    constructor() {
        super();
        this.state = {
            pageData: [],
            sortColumn: '',
            pageDataAccess: [],
            sortDirection: 'asc', // 'asc' para ascendente, 'desc' para descendente
            visibleRows: 6 // Número inicial de linhas visíveis
        };
    }

    componentDidMount() {
        let email = this.props.email;
        let dataURL = 'https://data.sherpagroupav.com/get_projects_details.php?email=' + email;

        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                this.setState({ pageData: res });
            });

        let grantAccess = 'https://data.sherpagroupav.com/get_projectaccess.php?email=' + email;
        fetch(grantAccess)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    pageDataAccess: res
                });
            });
    }

    handleSort = (column) => {
        const { sortColumn, sortDirection, pageData } = this.state;
        let newDirection = 'desc';

        if (sortColumn === column && sortDirection === 'desc') {
            newDirection = 'asc';
        }

        const sortedData = [...pageData].sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            const isANumber = !isNaN(aValue);
            const isBNumber = !isNaN(bValue);

            if (isANumber && isBNumber) {
                return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
            } else {
                const aStr = aValue ? aValue.toString().toLowerCase() : '';
                const bStr = bValue ? bValue.toString().toLowerCase() : '';

                if (aStr < bStr) return newDirection === 'asc' ? -1 : 1;
                if (aStr > bStr) return newDirection === 'asc' ? 1 : -1;
                return 0;
            }
        });

        this.setState({
            pageData: sortedData,
            sortColumn: column,
            sortDirection: newDirection
        });
    };

    loadMore = () => {
        this.setState((prevState) => ({
            visibleRows: prevState.visibleRows + 6
        }));
    };

    loadLess = () => {
        this.setState({
            visibleRows: 6
        });
    };


    formatDate = (dateString) => {
        const date = new Date(dateString.trim());

        
        const monthsFrench = [
            "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
            "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
        ];
        
        const monthsEnglish = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        
        const { BrowserPersistence } = Util;
        const storage = new BrowserPersistence();
        let storeview = storage.getItem('store_view_code');

        const day = date.getDate();
        const month = storeview === 'fr' ? monthsFrench[date.getMonth()] :  monthsEnglish[date.getMonth()] ;
        const year = date.getFullYear();
        
        return storeview === 'fr' ? `${day} ${month} ${year}` : `${month} ${day}, ${year}`;

    }

    
    render() {
        const { pageData, sortColumn, sortDirection, visibleRows } = this.state;

        const isArchive = this.props.isArchive;

        // console.log(this.state.pageData);

        if (pageData && pageData.length > 0 && this.state.pageDataAccess['access'] == 1) {
            return (
                <div className={wishlistClasses.tableWrap}>
                    <table className={wishlistClasses.sortable}>
                        <thead>
                            <tr>
                                <th onClick={() => this.handleSort('projectName')}>
                                    <span>
                                        <FormattedMessage id={'myWishlist.project_name'} defaultMessage={'Project name'} />
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={wishlistClasses.chevronDown}
                                        />
                                    </span>
                                    <span className={wishlistClasses[sortColumn === 'projectName' ? sortDirection : '']}></span>
                                </th>
                                <th onClick={() => this.handleSort('dateCreation')}>
                                    <span>
                                        <FormattedMessage id={'myWishlist.project_date_creation'} defaultMessage={'Creation date'} />
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={wishlistClasses.chevronDown}
                                        />
                                    </span>
                                    <span className={wishlistClasses[sortColumn === 'dateCreation' ? sortDirection : '']}></span>
                                </th>
                                <th onClick={() => this.handleSort('total')}>
                                    <span>
                                        <FormattedMessage id={'myWishlist.project_total'} defaultMessage={'Estimated value'} />
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={wishlistClasses.chevronDown}
                                        />
                                    </span>
                                    <span className={wishlistClasses[sortColumn === 'total' ? sortDirection : '']}></span>
                                </th>
                                <th onClick={() => this.handleSort('total')}>
                                    <span>
                                        <FormattedMessage id={'myWishlist.project_still_purchase'} defaultMessage={'Still to purchase'} />
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={wishlistClasses.chevronDown}
                                        />
                                    </span>
                                    <span className={wishlistClasses[sortColumn === 'total' ? sortDirection : '']}></span>
                                </th>
                                <th onClick={() => this.handleSort('numberProducts')}>
                                    <span>
                                        <FormattedMessage id={'myWishlist.project_n_produits'} defaultMessage={'N. produits'} />
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={wishlistClasses.chevronDown}
                                        />
                                    </span>
                                    <span className={wishlistClasses[sortColumn === 'numberProducts' ? sortDirection : '']}></span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isArchive == 'true'
                                ? pageData.filter((project) => project.projectName.toLowerCase().includes('archive')).map((project) => (
                                <tr key={project.id}>
                                <td><a href={'myprojects?id=' + project.id}>{project.projectName}</a></td>
                                <td>{project.dateCreation === null ? 'N/A' : this.formatDate(project.dateCreation)}</td>
                                <td>${project.total}</td>
                                <td>${project.estimateTotal}</td>
                                <td>{project.numberProducts}</td>
                                </tr>
                                ))
                                
                                : pageData.filter((project) => !project.projectName.toLowerCase().includes('archive')).map((project) => (
                                
                                <tr key={project.id}>
                                <td><a href={'myprojects?id=' + project.id}>{project.projectName}</a></td>
                                <td>{project.dateCreation === null ? 'N/A' : this.formatDate(project.dateCreation)}</td>
                                <td>${project.total}</td>
                                <td>${project.estimateTotal}</td>
                                <td>{project.numberProducts}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {pageData.length > visibleRows && (
                        <button onClick={this.loadMore} className={wishlistClasses.loadMoreButton}>
                            <span>Load More</span>
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={wishlistClasses.chevronDown}
                            />
                        </button>
                    )}
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}

/* ------------------- */

const titleIcon = <Icon src={ArrowUp} size={24} />;

const MyWishList = props => {

    const [seed, setSeed] = useState(1);
    const [hasProduct, setHasProduct] = useState(false);
    const [chevronOpen, setChevronOpen] = useState(false);

    const handleChevron = (idItem) => {

        // console.log(idItem);

    }

    const reset = () => {
        setSeed(Math.random());
    }
    const { email } = useDashboard();

    var isPartialQuantity = true;

    const url = window.location.href;

    const myprojects = url.includes("?id");

    const { BrowserPersistence } = Util;
    const storage = new BrowserPersistence();
    let storeview = storage.getItem('store_view_code');
    if (!storeview) {
        storeview = '';
    }

    if (storeview === 'fr') {
        categoryBannerIdentifierHomeBanner = 'projects_instructions_banner-fr';
        categoryBannerIdentifierHome = 'projects_instructions-fr';
    }

    // console.log(myprojects, 'myprojects');

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
    const { handleAddToCart, isAddingItem, success, errorMessage } = catProps;
    //const { handleAddToCart } = catProps;
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

    const talonProps = useCartPage({
        queries: {
            getCartDetails: GET_CART_DETAILS
        }
    });

    const {
        cartItems
    } = talonProps;

    // console.log(data);
    const queryParameters = new URLSearchParams(window.location.search);

    const wId = queryParameters.get('id');
    const isArchive = queryParameters.get('archive');

    const remove = async (id, wishlistId) => {

        //var element = document.getElementById('t'+id).querySelector('button[data-wid="'+wId+'"]');
        //var itemId = element.id.replace("minus_", '');
        let dataURL =
            'https://data.sherpagroupav.com/delete_fromproject.php?wid=' + wishlistId + '&cid=' + wId;
        console.log(dataURL);
        fetch(dataURL)
            .then(res => res.json())
            .then(document.getElementById("t" + id).remove())
            .then(reset());

        //await handleRemoveItem({ product_id: id });
        setRemoveMsg(true);
    };

    const [cacheAccordeon, setCacheAccordeon] = useState(false);

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

    // removed product_id

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
                        qty
                        store_id
                        wishlist_item_id
                    }
                }
            }
        `;

        const [addTodo, { data, loading, error }] = useMutation(
            TOGGLE_LIKED_PHOTO
        );
        const [selectValue, setSelectValue] = React.useState('');

        const { BrowserPersistence } = Util;
        const storage = new BrowserPersistence();
        let storeview = storage.getItem('store_view_code');
        if (!storeview) {
            storeview = '';
        }

        if (data) {
        }
        if (loading) return 'Submitting...';
        if (error) return `Submission error! ${error.message}`;
        /*if (1) {
            return (<>s</>);
        } else { */
        return (<>

            <div className={classes.new_project}>
                <input
                    className={classes.input_rename}
                    type="text"
                    ref={node => {
                        input = node;
                    }}
                    placeholder={storeview === 'fr' ? 'Entrez le nom du projet' : 'Enter project name'}
                />
                <input type="hidden" value={selectId} />
                <button
                    className={classes.rename_project}
                    onClick={e => {
                        e.preventDefault();
                        addTodo({ variables: { category_name: input.value } });
                        input.value = '';

                        if (storeview === 'fr') {
                            window.alert('New project created.');
                        }
                        else {
                            window.alert('New project created.');
                        }
                        setSelectValue(999);
                        window.location.reload();
                    }}
                >
                    {storeview === 'fr' ? 'Créer un nouveau projet' : 'Create new project'}
                </button>
            </div>

        </>);
        //}
    }

    function MoveToCart(uid) {

        const talonProps = useCartPage({
            queries: {
                getCartDetails: GET_CART_DETAILS
            }
        });

        const {
            cartItems,
            hasItems,
            isCartUpdating,
            setIsCartUpdating,
            shouldShowLoadingIndicator
        } = talonProps;

        console.log('cartItems');
        if (cartItems) {
            console.log(cartItems);
        }

        function displayMoveToCart(isArchive) {
            if (isArchive == 1) {
                return;
            } else {
                return (
                    <div className={classes.wrapperMoveToCart}>
                        <div className={classes.wrapperTooltip}>
                            <span className={classes.tooltip}><FormattedMessage id={'project.tooltipMovetocart'} defaultMessage={'Moves the balance of unpurchased product for this project to cart'} /></span>
                            <button className={classes.button_move_project}><FormattedMessage id={'project.movetocart'} defaultMessage={'Move Remaining to Cart'} />
                            </button>
                        </div>
                        <Link className={defaultClasses.btnPurchase} to={resourceUrl('/cart')}>
                            <FormattedMessage id={'project.backtocart'} defaultMessage={'Go to Cart'} />
                        </Link>
                    </div>
                );
            }
        }

        if (wId) {
            return (
                <>
                    <Popup
                        trigger={displayMoveToCart(isArchive)}
                        modal
                        nested
                    >
                        {close => (
                            <div className="modalreact">
                                <button className="close" onClick={close}>
                                    &times;
                                </button>
                                <div className="header"> <FormattedMessage id={'project.movetocart'} defaultMessage={'Move project to Cart'} /> <ProjectName cid={wId} /></div>
                                <div className="content content-align">
                                    {' '}
                                    <FormattedMessage id={'project.movecontent'} defaultMessage={'This will send your entire projects contents to the Shopping Cart.'} />
                                    <br /><br />
                                    <b><FormattedMessage id={'project.moveproceed'} defaultMessage={'Do you want to proceed?'} /></b>
                                </div>
                                <div className="actions">
                                    <button
                                        className={classes.button_move_project_yes}

                                        onClick={() => {

                                            var elements = document.getElementsByClassName("mywishlist-move_confirm-1_m");

                                            console.log('MOVEBEFORE' + productId)
                                            console.log(cartItems);

                                            function checkProjectQuantity(arrayCategory, pid) {

                                                const obj = JSON.parse(arrayCategory);

                                                var x = 0;

                                                if (obj) {

                                                    obj.forEach(function (arrayItem) {
                                                        console.log(arrayItem.product_id + ' arrayItem.product_id')
                                                        if (arrayItem.product_id == pid) {
                                                            x = parseInt(arrayItem.qty);
                                                        }

                                                    });

                                                    return x;
                                                }
                                            }

                                            console.log('---------------------');

                                            isPartialQuantity = false;

                                            console.log(elements.length);

                                            for (var i = 0; i < elements.length; i++) {

                                                var inCart = 0;
                                                var inProject = 0;

                                                var productId = (elements[i].id).replace("partial_", '');

                                                cartItems.forEach(function (arrayItem) {
                                                    //console.log('arrayItem.category')
                                                    //console.log(arrayItem.category.product_id);

                                                    inCart = arrayItem.quantity;

                                                    if (arrayItem.product.id == productId) {
                                                        inProject = checkProjectQuantity(arrayItem.category, productId);

                                                        if (inProject >= inCart) {
                                                            document.getElementById('btn_move_' + productId).disabled = true;
                                                            document.getElementById('btn_move_' + productId).style.opacity = '0.3';
                                                            document.getElementById('btn_move_p' + productId).disabled = true;
                                                            document.getElementById('btn_move_p' + productId).style.opacity = '0.3';
                                                        } else {
                                                            document.getElementById('btn_move_' + productId).disabled = false;
                                                            document.getElementById('btn_move_' + productId).style.opacity = '1';
                                                            document.getElementById('btn_move_p' + productId).disabled = false;
                                                            document.getElementById('btn_move_p' + productId).style.opacity = '1';
                                                        }
                                                    }



                                                });

                                                console.log('[' + productId + '] In cart : ' + inCart + ' In project : ' + inProject);

                                                elements[i].click();
                                            }
                                            isPartialQuantity = true;

                                            console.log('MOVEAFTER')
                                            console.log(cartItems);

                                        }}
                                    >
                                        <FormattedMessage id={'project.yes'} defaultMessage={'Yes'} />
                                    </button>
                                    <button
                                        className={classes.button_move_project_no}
                                        onClick={() => {
                                            close();
                                        }}
                                    >
                                        <FormattedMessage id={'project.cancel'} defaultMessage={'Cancel and close'} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </Popup>
                </>
            );
        }
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
                        '/myprojects?id=' +
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
                    placeholder={storeview === 'fr' ? 'Nom du projet' : 'New project name'}
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
                    {storeview === 'fr' ? 'Dupliquer le projet' : 'Duplicate project'}
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
                    {storeview === 'fr' ? 'Supprimer le projet' : 'Delete project'}
                </button>
            );
        if (error) return `Submission error! ${error.message}`;

        return (
            <div>
                <form
                    onSubmit={e => {
                        e.preventDefault();

                        if (confirm('This action will delete your project, are you sure?')) {

                            removeProject({ variables: { category_id: cid } });
                            window.alert('Project deleted.');
                            window.location.href = '/myprojects';

                        } else {

                            console.log('Thing was not saved to the database.');
                        }

                    }}
                >
                    <button type="submit" className={classes.add_to_project}>
                        {' '}
                        {storeview === 'fr' ? 'Supprimer définitivement le projet' : 'Permanently Delete Project'}
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
                    {storeview === 'fr' ? "PROJET D'ARCHIVAGE" : "ARCHIVING PROJECT"}
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
                        window.location.href = '/myprojects';
                    }}
                >
                    <button type="submit" className={classes.add_to_project}>
                        {' '}
                        {storeview === 'fr' ? "Archiver le projet" : "Archive project"}
                    </button>
                </form>
            </div>
        );
    }

    {/* class RestoreProject extends Component {
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

            let projectname = this.state.pageData.pname && this.state.pageData.pname;

            function returnVal() {
                var e = document.getElementById('widn');
                var value = e.innerHTML;
                return value;
            }

            const [restoreProject, { data, loading, error }] = useMutation(
                RENAME_PROJECT_RESTORE
            );

            if(projectname && projectname.startsWith('ARCHIVE - ')) {

                return (
                    <div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            console.log('PIN ' + returnVal());
                            restoreProject({
                                variables: {
                                    category_name: returnVal(),
                                    category_id: wId
                                }
                            });
                            window.alert('Project restored.');
                            window.location.href = '/myprojects';
                        }}
                    >
                        <button type="submit" className={classes.add_to_project}>
                            {' '}
                            Restore project
                        </button>
                    </form>
                </div>
                );

            } else {

                return (<Select />);

            }

            
        }
    } */}

    function RestoreProject({ cid }) {
        const [restoreProject, { data, loading, error }] = useMutation(
            RENAME_PROJECT
        );

        if (loading)
            return (
                <button type="" className={classes.add_to_project}>
                    {storeview === 'fr' ? "PROJET DE RESTAURATION" : "RESTORING PROJECT"}
                </button>
            );
        if (error) return `Restore error! ${error.message}`;

        function returnVal() {
            var e = document.getElementById('widn');
            var value = e.innerHTML.slice(10);
            return value;
        }

        if (isArchive == 1) {

            return (
                <>

                    <div id={'restore' + cid}>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                console.log('PIN ' + returnVal());
                                restoreProject({
                                    variables: {
                                        category_name: returnVal(),
                                        category_id: wId
                                    }
                                });
                                window.alert('Project restored.');
                                window.location.href = '/myprojects';
                            }}
                        >
                            <button type="submit" className={classes.add_to_project}>
                                {' '}
                                {/* Restore project */}
                                <FormattedMessage
                                    id={'myWishlist.restoreProject'}
                                    defaultMessage={'Restore project'}
                                />
                            </button>
                        </form>
                    </div>
                </>

            );
        } else {
            return (<Select cid={cid} />);
        }
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
                        {storeview === 'fr' ? "Déplacer le projet vers le panier" : "Move Project to Cart"}
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
                    {storeview === 'fr' ? "RENOMMER LE PROJET" : "RENAMING PROJECT"}
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
                        placeholder={storeview === 'fr' ? 'Nouveau nom' : 'New name'}
                    />
                    <button type="submit" className={classes.rename_project}>
                        {/* Rename project */}
                        {storeview === 'fr' ? 'Renommer le projet' : 'Rename project'}
                    </button>
                </form>
            </div>
        );
    }

    const Select = ({ cid, archived }) => {
        const [selectValue, setSelectValue] = React.useState('');
        const onChange = event => {
            const value = event.target.value;
            setSelectValue(value);
        };


        return (
            <div className={defaultClasses.wrapper_project_dropdown} id={'actions' + cid}>
                {archived ?
                    <select
                        onChange={onChange}
                        className={[classes.project_dropdown, defaultClasses.project_dropdown].join(' ')}
                    >
                        {storeview === 'fr' ? <option value="" disabled selected hidden>Options du projet</option> : <option value="" disabled selected hidden>Project Options</option>}

                        {/* <option value="1">Create a new project</option> */}

                        {storeview === 'fr' ? <option value="5">Dupliquer le projet</option> : <option value="5">Duplicate project</option>}
                        {storeview === 'fr' ? <option value="4">Supprimer le projet actuel</option> : <option value="4">Delete current project</option>}
                    </select>
                    :
                    <select
                        onChange={onChange}
                        className={[classes.project_dropdown, defaultClasses.project_dropdown].join(' ')}
                    >
                        {storeview === 'fr' ? <option value="" disabled selected hidden>Options du projet</option> : <option value="" disabled selected hidden>Project Options</option>}

                        {/* <option value="1">Create a new project</option> */}

                        {storeview === 'fr' ? <option value="5">Dupliquer le projet</option> : <option value="5">Duplicate project</option>}
                        {storeview === 'fr' ? <option value="2">Renommer le projet actuel</option> : <option value="2">Rename current project</option>}
                        {storeview === 'fr' ? <option value="3">Archiver le projet actuel</option> : <option value="3">Archive current project</option>}
                        {storeview === 'fr' ? <option value="4">Supprimer le projet actuel</option> : <option value="4">Delete current project</option>}
                    </select>

                }
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
        let qntProduit = 0;

        // const switchBTN = document.getElementById("switchBTN");
        // console.log(switchBTN);

        // if(pageDataAccess["access"] && pageDataAccess["access"] != null ){
        //     console.log(pageDataAccess["access"] + '******************');
        // } 


        // if (pageDataAccess && pageDataAccess["access"] != null) {
        //     // console.log('iciiiiiiiiiiiiiii');
        //     if (pageDataAccess["access"] === "1") {
        //         // console.log('erreur ici?**********');
        //         document.getElementById("switchBTN").checked = false
        //     } else if (pageDataAccess["access"] === "0") {
        //         // console.log('peut etre ici?===============');
        //         document.getElementById("switchBTN").checked = true
        //     }
        // }

        // const handleSwitch = async () => {
        //     console.log("AIE AIE IAE");
        //     // console.log(switchBTN);
        //     if (document.getElementById("switchBTN").checked === false) {
        //         document.getElementById("switchBTN").checked = true
        //         await fetch(`https://data.sherpagroupav.com/set_projectaccess.php?email=${email}&status=0`)
        //             .then(res => res.json())
        //             .then(res => {
        //                 console.log(res + ' reeeeeeeeees1');
        //                 // setPageDataAccess('0')
        //                 document.getElementById("switchBTN").checked = true
        //                 window.location.reload();
        //             });
        //     } else if (document.getElementById("switchBTN").checked === true) {
        //         document.getElementById("switchBTN").checked = false
        //         await fetch(`https://data.sherpagroupav.com/set_projectaccess.php?email=${email}&status=1`)
        //             .then(res => res.json())
        //             .then(res => {
        //                 console.log(res + ' reeeeeeeeees0');
        //                 // setPageDataAccess('1')
        //                 document.getElementById("switchBTN").checked = false
        //                 window.location.reload();
        //             });
        //     }
        // }

        setTimeout(function () {

            var elements = document.getElementsByClassName("increment");
            var elementsD = document.getElementsByClassName("decrement");

            var inputChangePartial = document.getElementsByClassName("partialQuantity");

            // console.log('elementsD');
            // console.log(elementsD);

            for (var i = 0; i < elementsD.length; i++) {
                elementsD[i].addEventListener('click', myFunctionD, false);
            }

            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', myFunction, false);
            }

            for (var i = 0; i < inputChangePartial.length; i++) {
                inputChangePartial[i].addEventListener('change', myFunctionPartial, false);
            }

        }, 50);

        var myFunctionPartial = function () {

            // console.log('myFunctionPartial ' + this.value);

            /*if(this.id != 'plus_undefined') {

                var containerIdMinus = this.id;
                var containerIdMinusComplete = containerIdMinus.replace("plus_", "");
                
                var currentQty = document.querySelector('#q' + containerIdMinusComplete).querySelector('input').value;
                var futureQty = parseInt(currentQty);
                var currentQtySelector = parseInt(document.querySelector('#move_item_box_' + containerIdMinusComplete).querySelector('input').value) + 1;

                console.log(currentQtySelector +' > '+futureQty)

                if(currentQtySelector >= futureQty) {
                    document.getElementById("plus_"+containerIdMinusComplete).disabled = true;
                } else {
                    document.getElementById("plus_"+containerIdMinusComplete).disabled = false;
                }

            }*/

        };

        var myFunction = function () {

            // console.log('here hello ' + this.id);

            if (this.id != 'plus_undefined') {

                setTimeout(function () { reset(); }, 1500);
                /*var containerIdMinus = this.id;
                var containerIdMinusComplete = containerIdMinus.replace("plus_", "");
                
                var currentQty = document.querySelector('#q' + containerIdMinusComplete).querySelector('input').value;
                var futureQty = parseInt(currentQty);
                var currentQtySelector = parseInt(document.querySelector('#move_item_box_' + containerIdMinusComplete).querySelector('input').value) + 1;

                console.log(currentQtySelector +' > '+futureQty)

                if(currentQtySelector >= futureQty) {
                    document.getElementById("plus_"+containerIdMinusComplete).disabled = true;
                } else {
                    document.getElementById("plus_"+containerIdMinusComplete).disabled = false;
                }*/

            } else if (this.id == 'plus_undefined') {



                //var containerIdMinus = this.id;
                var containerIdMinusComplete = this.getAttribute('data-pid');

                var currentQty = document.querySelector('#q' + containerIdMinusComplete).querySelector('input').value;
                var futureQty = parseInt(currentQty);
                var currentQtySelector = parseInt(document.querySelector('#move_item_box_' + containerIdMinusComplete).querySelector('input').value) + 1;

                //console.log(currentQtySelector +' > '+futureQty)

                if (currentQtySelector >= futureQty) {
                    document.body.querySelector('button[data-pidselect="p' + containerIdMinusComplete + '"]').disabled = true;
                    //document.getElementById("plus_"+containerIdMinusComplete).disabled = true;
                } else {
                    document.body.querySelector('button[data-pidselect="p' + containerIdMinusComplete + '"]').disabled = false;
                    //document.getElementById("plus_"+containerIdMinusComplete).disabled = false;
                }

                /*let dataURL = 'https://data.sherpagroupav.com/set_projectItemQty.php?wid='+this.dataset.wid+'&increment=1&cid='+wId;
                console.log(dataURL);
                fetch(dataURL)
                    .then(res => res.json())
                    .then(setTimeout(function(){ reset(); }, 10));*/
            }

        };

        var myFunctionD = function () {

            // console.log('there');

            if (this.id != 'minus_undefined') {
                setTimeout(function () { reset(); }, 1500);
                /*var containerIdMinus = this.id;
                var containerIdMinusComplete = containerIdMinus.replace("minus_", "");
                
                var currentQty = document.querySelector('#q' + containerIdMinusComplete).querySelector('input').value;
                var currentQtySelector = parseInt(document.querySelector('#move_item_box_' + containerIdMinusComplete).querySelector('input').value) - 1;

                console.log(currentQtySelector+' < '+currentQty)

                if(parseInt(currentQtySelector) < currentQty) {
                    document.getElementById("plus_"+containerIdMinusComplete).disabled = false;
                } else {
                    document.getElementById("plus_"+containerIdMinusComplete).disabled = true;
                }*/

            } else if (this.id == 'minus_undefined') {
                //console.log('CALLED');

                //var containerIdMinus = this.id;
                var containerIdMinusComplete = this.getAttribute('data-pid');

                var currentQty = document.querySelector('#q' + containerIdMinusComplete).querySelector('input').value;
                var currentQtySelector = parseInt(document.querySelector('#move_item_box_' + containerIdMinusComplete).querySelector('input').value) - 1;

                //console.log(currentQtySelector+' < '+currentQty)

                if (parseInt(currentQtySelector) < currentQty) {
                    document.body.querySelector('button[data-pidselect="p' + containerIdMinusComplete + '"]').disabled = false;
                    //document.getElementById("plus_"+containerIdMinusComplete).disabled = false;
                } else {
                    document.body.querySelector('button[data-pidselect="p' + containerIdMinusComplete + '"]').disabled = true;
                    //document.getElementById("plus_"+containerIdMinusComplete).disabled = true;
                }

                /*let dataURL = 'https://data.sherpagroupav.com/set_projectItemQty.php?wid='+this.dataset.wid+'&increment=-1&cid='+wId;
                console.log(dataURL);
                fetch(dataURL)
                    .then(res => res.json())
                    .then(setTimeout(function(){ reset(); }, 10));*/
            }

        };

        // console.log('val.product');
        // console.log(data);

        const { mobileView } = useMobile();

        // console.log('mobileView'+mobileView);

        let wrapperProject = document.getElementById("productsWrapper");
        // console.log(wrapperProject, 'je suis iciiiiiii!!!!!!!!!!!');


        return (
            <div className={defaultClasses.columns}>
                <Title>{`MyProjects`}</Title>
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
                                    {myprojects && wId !== undefined &&
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
                                                            defaultMessage={'MyProjects'}
                                                        />{' '}
                                                        <ProjectName cid={wId} />
                                                    </span>
                                                </h1>
                                                <div id={'hidden_div'} className={defaultClasses.hidden_div}>
                                                    <AddTodo uid={wId} />
                                                </div>
                                            </div>

                                            <TotalProjet cid={wId} key={seed} />



                                        </div>
                                    }
                                    {wId !== undefined && wId !== null && (
                                        <>
                                            <div className={defaultClasses.wrapperBtnDropdown}>
                                                <div className={defaultClasses.wrapperGauche}>
                                                    <Link
                                                        className={defaultClasses.btnPurchase}
                                                        to={resourceUrl('/orders?project=' + wId)}
                                                    ><FormattedMessage id={'project.history'} defaultMessage={'Project Purchase History'} /></Link>
                                                    <RestoreProject cid={wId} />
                                                    {isArchive && <Select cid={wId} archived={true} />}
                                                </div>
                                                <MoveToCart uid={wId} />
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
                                                    id="productsWrapper"
                                                >
                                                    {data.map((val, index) => {


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
                                                                        res.display == 1
                                                                    ) {
                                                                        // console.log('projectQty ' + pid + ' ' + cid)
                                                                        //document.getElementById('.q'+val.id+' #quantity').value=val.qty;
                                                                        //var targetDiv = getElementsByClassName('q'+val.id).document.getElementById("quantity")[0];
                                                                        //targetDiv.value = val.qty;
                                                                        //document.getElementById('q'+val.id).getElementById("quantity")[0].value = 8;

                                                                        var checkExisting = document.getElementById(
                                                                            't' +
                                                                            pid
                                                                        );

                                                                        if (checkExisting) {
                                                                            setHasProduct(true);

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

                                                                        }


                                                                        /*console.log(
                                                                            'Is active' +
                                                                                val.product.price.regularPrice.amount.value.toFixed(
                                                                                    2
                                                                                )
                                                                        );*/
                                                                        /*qntProduit = qntProduit + val.qty;
                                                                        console.log(
                                                                                'Quantity Produit : ' +
                                                                                qntProduit
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
                                                                        );*/
                                                                        /*document.getElementById(
                                                                            'totalApprox'
                                                                        ).innerHTML = qntProduit + ' products - ' + total.toFixed(
                                                                            2
                                                                        ) + '$';*/


                                                                    } else {
                                                                        var toBeRemoved = document.getElementById('t' + pid);

                                                                        if (toBeRemoved) {
                                                                            document.getElementById('t' + pid).remove();

                                                                        }

                                                                    }
                                                                });
                                                            // console.log('returned' + projectQty);
                                                            return 1;
                                                        }
                                                        // verifier si il y a des enfants
                                                        //let wrapperProjects = document.getElementById("productsWrapper")
                                                        // console.log(belongToProject(
                                                        //     val.product.id,
                                                        //     wId
                                                        // ), 'belong');


                                                        if (
                                                            belongToProject(
                                                                val.product.id,
                                                                wId
                                                            )
                                                        ) {

                                                            let qtyCart = 0;
                                                            let realQty = 0;
                                                            cartItems.forEach(c => {
                                                                let filterCatergory = [];
                                                                const cartJSON = JSON.parse(c.category);
                                                                if (cartJSON) {
                                                                    filterCatergory = cartJSON.filter(c => c.product_id === val.product.id && c.category_id === wId);
                                                                    if (filterCatergory.length) {
                                                                        qtyCart = filterCatergory[0].qty;
                                                                        realQty = filterCatergory[0].qtyCategory;
                                                                    }
                                                                }
                                                            });

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
                                                                                {/* --------- ICI le green pills ------- */}
                                                                                {isArchive != 1 && (
                                                                                    <SpecialPriceTo pid={val.product.id} />
                                                                                )}
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
                                                                                {/* <IsInCart pid={val.product.id} cid={wId} email={email} key={seed} /> */}
                                                                                <div className={classes.brand_name}>
                                                                                    {/* <BrandName pid={val.product.id} /> */}
                                                                                </div>
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
                                                                                    </b>
                                                                                    {' '}
                                                                                    {
                                                                                        val.product.sku
                                                                                    }
                                                                                    {qtyCart > 0 ?
                                                                                    <p>
                                                                                        {/* <SoldIn pid={val.product.id} /> */}
                                                                                        {/* Quantity remaining: {qtyCart} */}
                                                                                        <FormattedMessage
                                                                                            id={
                                                                                                'item.qtyRemaining'
                                                                                            }
                                                                                            defaultMessage={
                                                                                                'Quantity Remaining'
                                                                                            }
                                                                                        /> : { realQty - qtyCart}
                                                                                    </p>
                                                                                    : 
                                                                                    <p></p>
                                                                                    }

                                                                                </div>
                                                                                {isArchive != 1 && (
                                                                                    <SpecialPrice productId={val.product.id} regularPrice={val.product.price.regularPrice.amount.value.toFixed(2)} />
                                                                                )}
                                                                                {/*<span
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
                                                                                    {val.product.price.regularPrice.amount.value.toFixed(2)}
                                                                                </span> */}
                                                                            </div>
                                                                            {isArchive != 1 && (
                                                                                <div
                                                                                    id={
                                                                                        'q' +
                                                                                        val.id
                                                                                    }
                                                                                    className={
                                                                                        classes.wishlist_quantity
                                                                                    }
                                                                                >

                                                                                    <RealQuantity cid={wId} pid={val.product.id} wid={val.id} />

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
                                                                                                        .id,
                                                                                                    val.id
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
                                                                            )}
                                                                            <div className={classes.wrapperPurchased}>
                                                                                <AlreadyPurchased wId={wId} sku={val.product.sku} pid={val.product.id} email={email} />
                                                                                <RemainProject wId={wId} sku={val.product.sku} pid={val.product.id} email={email} />
                                                                            </div>
                                                                            <div
                                                                                className={
                                                                                    classes.actions_wrapper
                                                                                }
                                                                            >
                                                                                {isArchive != 1 && (
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
                                                                                                        id={'btn_move_' + val.product.id}
                                                                                                        className={
                                                                                                            'active_item' +
                                                                                                            wId
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            var currentQty = document
                                                                                                                .querySelector(
                                                                                                                    '#q' +
                                                                                                                    val.id
                                                                                                                )
                                                                                                                .querySelector(
                                                                                                                    'input'
                                                                                                                )
                                                                                                                .value;

                                                                                                            const filterpurchasedProduct = purchasedProduct.filter(p => p.pid === val.product.id);
                                                                                                            let qtyPurchasedProduct = 0;

                                                                                                            if (filterpurchasedProduct.length > 0) {
                                                                                                                qtyPurchasedProduct = filterpurchasedProduct[0].qty;
                                                                                                            }

                                                                                                            const tempProps = { ...val.product };
                                                                                                            tempProps.qty = currentQty - qtyCart - qtyPurchasedProduct;
                                                                                                            tempProps.qtyCategory = currentQty - qtyPurchasedProduct;
                                                                                                            tempProps.categoryId = wId;
                                                                                                            tempProps.categoryName = projectname;

                                                                                                            // console.log('coucoucoucou');
                                                                                                            // console.log(tempProps);

                                                                                                            if (tempProps.qty != 0) {
                                                                                                                handleAddToCart(
                                                                                                                    tempProps
                                                                                                                );
                                                                                                            }
                                                                                                            //window.alert(errorMessage);
                                                                                                            if (errorMessage) {
                                                                                                                addToast({
                                                                                                                    type: 'error',
                                                                                                                    message: val.product.name + ' the requested qty is not available.',
                                                                                                                    dismissable: true,
                                                                                                                    timeout: 4000
                                                                                                                });
                                                                                                            } else {
                                                                                                                addToast({
                                                                                                                    type: 'info',
                                                                                                                    message: val.product.name + ' added to the cart.',
                                                                                                                    dismissable: true,
                                                                                                                    timeout: 4000
                                                                                                                });
                                                                                                            }
                                                                                                            /*addToast({
                                                                                                                type: 'info',
                                                                                                                message: val.product.name + ' added to the cart.',
                                                                                                                dismissable: true,
                                                                                                                timeout: 4000
                                                                                                            });*/

                                                                                                            setTimeout(function () { reset(); }, 2000);


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
                                                                                                    {/*<button
                                                                                                onClick={() => {

                                                                                                    var x = document.getElementById('qty_item_box_'+val.id);
                                                                                                    if (window.getComputedStyle(x).display === "none") {
                                                                                                        document.getElementById('qty_item_box_'+val.id).style.display='block';
                                                                                                    } else {
                                                                                                        document.getElementById('qty_item_box_'+val.id).style.display='none';
                                                                                                    }

                                                                                                    
                                                                                                }}
                                                                                            >
                                                                                                <span
                                                                                                    className={
                                                                                                        classes.move_item
                                                                                                    }
                                                                                                >
                                                                                                    <FormattedMessage
                                                                                                        id={
                                                                                                            'myWishlist.moveToCartBtnPartialEdit'
                                                                                                        }
                                                                                                        defaultMessage={
                                                                                                            'Edit cart quantity'
                                                                                                        }
                                                                                                    />
                                                                                                </span>
                                                                                            </button>
                                                                                            <div 
                                                                                                id={'qty_item_box_'+val.id} 
                                                                                                className={ classes.move_item_static + ' move_item_ref' }>
                                                                                                <Quantity
                                                                                                    initialValue={1} isChildren={1} productId={val.id} ignore={1} 
                                                                                                    /> 
                                                                                            <button

                                                                                                className={'move_confirm_partial_off'}
                                                                                                onClick={() => {
                                                                                                    var currentQty = document
                                                                                                        .querySelector(
                                                                                                            '#move_item_box_' +
                                                                                                            val.id
                                                                                                        )
                                                                                                        .querySelector(
                                                                                                            'input'
                                                                                                        )
                                                                                                        .value;

                                                                                                    const tempProps = {...val.product};
                                                                                                    tempProps.qty = currentQty;
                                                                                                    tempProps.categoryId = wId;
                                                                                                    
                                                                                                    tempProps.categoryName = '';
                                                                                                    tempProps.category = 'BINGO';

                                                                                                    console.log('coucoucoucou');
                                                                                                    console.log(tempProps);

                                                                                                    handleAddToCart(
                                                                                                        tempProps
                                                                                                    );

                                                                                                    addToast({
                                                                                                        type: 'info',
                                                                                                        message: val.product.name + ' added to the cart.',
                                                                                                        dismissable: true,
                                                                                                        timeout: 4000
                                                                                                    });
                                                                                                   
                                                                                                }}
                                                                                            >
                                                                                                {!mobileView && (
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
                                                                                                )}
                                                                                                {mobileView && (
                                                                                                    <p
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
                                                                                                    </p>
                                                                                                )}
                                                                                                
                                                                                            </button> 
                                                                                            </div>*/}
                                                                                                    <button
                                                                                                        id={'btn_move_p' + val.product.id}
                                                                                                        onClick={(e) => {

                                                                                                            var x = document.getElementById('move_item_box_' + val.id);
                                                                                                            if (window.getComputedStyle(x).display === "none") {
                                                                                                                document.getElementById('move_item_box_' + val.id).style.display = 'block';
                                                                                                                console.log(document.getElementById('up' + val.id));
                                                                                                                document.getElementById('up' + val.id).style.display = 'block';
                                                                                                                document.getElementById('down' + val.id).style.display = 'none';
                                                                                                            } else {
                                                                                                                document.getElementById('move_item_box_' + val.id).style.display = 'none';
                                                                                                                document.getElementById('up' + val.id).style.display = 'none';
                                                                                                                document.getElementById('down' + val.id).style.display = 'block';
                                                                                                            };
                                                                                                        }}
                                                                                                        className={classes.buttonMove}
                                                                                                    >
                                                                                                        <span
                                                                                                            className={
                                                                                                                classes.move_item
                                                                                                            }
                                                                                                            id={val.product.id}
                                                                                                            onClick={handleChevron(val.product.id)}

                                                                                                        >
                                                                                                            <FormattedMessage
                                                                                                                id={
                                                                                                                    'myWishlist.moveToCartBtnPartial'
                                                                                                                }
                                                                                                                defaultMessage={
                                                                                                                    'Move partial quantity to cart'
                                                                                                                }
                                                                                                            />
                                                                                                            {/* <span className={classes.arrowDown}></span> */}
                                                                                                            <FontAwesomeIcon
                                                                                                                icon={
                                                                                                                    faChevronDown
                                                                                                                }
                                                                                                                id={'down' + val.id}
                                                                                                                className={classes.chevronDown}
                                                                                                            />
                                                                                                            <FontAwesomeIcon
                                                                                                                icon={
                                                                                                                    faChevronUp
                                                                                                                }
                                                                                                                id={'up' + val.id}
                                                                                                                className={classes.chevronUp}
                                                                                                            />
                                                                                                        </span>
                                                                                                    </button>
                                                                                                    <div
                                                                                                        id={'move_item_box_' + val.id}
                                                                                                        className={classes.move_item_static + ' move_item_ref'}>
                                                                                                        <Quantity
                                                                                                            initialValue={1} isChildren={1} productId={val.id} ignore={1} /*onClick={reset} wid={wId} */
                                                                                                        />
                                                                                                        <button
                                                                                                            id={'partial_' + val.product.id}
                                                                                                            // className={'move_confirm_partial'}
                                                                                                            className={
                                                                                                                classes.move_confirm
                                                                                                            }
                                                                                                            onClick={() => {
                                                                                                                var currentQty = document
                                                                                                                    .querySelector(
                                                                                                                        '#q' +
                                                                                                                        val.id
                                                                                                                    )
                                                                                                                    .querySelector(
                                                                                                                        'input'
                                                                                                                    )
                                                                                                                    .value;

                                                                                                                var currentQtyPartial = document
                                                                                                                    .querySelector(
                                                                                                                        '#move_item_box_' +
                                                                                                                        val.id
                                                                                                                    )
                                                                                                                    .querySelector(
                                                                                                                        'input'
                                                                                                                    )
                                                                                                                    .value;

                                                                                                                console.log(isPartialQuantity);
                                                                                                                const filterpurchasedProduct = purchasedProduct.filter(p => p.pid === val.product.id);
                                                                                                                let qtyPurchasedProduct = 0;

                                                                                                                if (filterpurchasedProduct.length > 0) {
                                                                                                                    qtyPurchasedProduct = filterpurchasedProduct[0].qty;
                                                                                                                }

                                                                                                                const tempProps = { ...val.product };

                                                                                                                if (isPartialQuantity) {
                                                                                                                    tempProps.qty = currentQtyPartial;
                                                                                                                }
                                                                                                                else {
                                                                                                                    tempProps.qty = currentQty - qtyCart - qtyPurchasedProduct;
                                                                                                                }

                                                                                                                tempProps.categoryId = wId;
                                                                                                                tempProps.categoryName = projectname;
                                                                                                                tempProps.qtyCategory = currentQty - qtyPurchasedProduct;
                                                                                                                console.log('beubeu');
                                                                                                                console.log(handleAddToCart(tempProps));
                                                                                                                console.log('beubeu');
                                                                                                                 // Fill a map with field/section -> error.
                                                                                                                // const { handleAddToCart, isAddingItem, success, errorMessage } = catProps;
                                                                                                                window.alert(errorMessage);
                                                                                                                if (errorMessage) {
                                                                                                                    addToast({
                                                                                                                        type: 'error',
                                                                                                                        message: val.product.name + ' the requested qty is not available.',
                                                                                                                        dismissable: true,
                                                                                                                        timeout: 4000
                                                                                                                    });
                                                                                                                } else {
                                                                                                                    addToast({
                                                                                                                        type: 'info',
                                                                                                                        message: val.product.name + ' added to the cart.',
                                                                                                                        dismissable: true,
                                                                                                                        timeout: 4000
                                                                                                                    });
                                                                                                                }
                                                                                                                
                                                                                                                /*addToast({
                                                                                                                    type: 'info',
                                                                                                                    message: val.product.name + ' added to the cart.',
                                                                                                                    dismissable: true,
                                                                                                                    timeout: 4000
                                                                                                                });*/

                                                                                                            }}
                                                                                                        >
                                                                                                            {!mobileView && (
                                                                                                                <span
                                                                                                                // className={
                                                                                                                //     classes.move_confirm
                                                                                                                // }
                                                                                                                // style={{backgroundColor:'yellow', width:'200px', height:'200px'}}
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
                                                                                                            )}
                                                                                                            {mobileView && (
                                                                                                                <p

                                                                                                                // style={{backgroundColor:'yellow', width:'200px', height:'200px'}}
                                                                                                                >
                                                                                                                    <FormattedMessage
                                                                                                                        id={
                                                                                                                            'myWishlist.moveConfirm'
                                                                                                                        }
                                                                                                                        defaultMessage={
                                                                                                                            'Confirm'
                                                                                                                        }
                                                                                                                    />
                                                                                                                </p>
                                                                                                            )}

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
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        }
                                                    })}

                                                    {!hasProduct && myprojects && (
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
                                                                        'Browse products and add them to this project'
                                                                    }
                                                                />
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {/* {typeof data == 'undefined' && (
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
                                        )} */}


                                        {wId == undefined && (
                                            <>
                                                <Suspense fallback={''}>
                                                    <Banner
                                                        identifier={
                                                            categoryBannerIdentifierHomeBanner
                                                        }
                                                        showBanner={
                                                            showCategoryBanners
                                                        }
                                                    />
                                                    <ToggleAccess email={email} wid={wId} />
                                                    <TableProjects email={email} isArchive={isArchive} />
                                                    <div onClick={() => setCacheAccordeon(!cacheAccordeon)} className={classes.linkAccordeon}>
                                                        <p>
                                                            <FormattedMessage
                                                                id={
                                                                    'myWishlist.showAccordeon'
                                                                }
                                                                defaultMessage={
                                                                    'Learn more about my projects'
                                                                }
                                                            />
                                                        </p>
                                                        {!cacheAccordeon ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
                                                    </div>

                                                    {/* ----- HIDE WITH LINK  ------ */}
                                                    {cacheAccordeon &&
                                                        <>
                                                            <p>&nbsp;</p>
                                                            <Banner
                                                                identifier={
                                                                    categoryBannerIdentifierHome
                                                                }
                                                                showBanner={
                                                                    showCategoryBanners
                                                                }
                                                            />
                                                        </>
                                                    }
                                                    {/* ----------------------------------------- */}
                                                </Suspense>

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
                <Title>{`MyProjects - ${STORE_NAME}`}</Title>
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
