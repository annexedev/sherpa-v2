import React, { useState, useEffect, Suspense, Component } from 'react';
import { QuantityPicker } from 'react-qty-picker';
import { string, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import { useToasts } from '@magento/peregrine';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { FormattedMessage, useIntl } from 'react-intl';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';
import proClasses from '../ProductFullDetail/productFullDetail.css';
import { useStyle } from '../../classify';
import Image from '../Image';
import GalleryItemShimmer from './item.shimmer';
import defaultClasses from './item.css';
import CompareButton from '../Compare/compareButton';
import { useProductFullDetail } from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import {
    ADD_SIMPLE_CUSTOM_MUTATION,
    ADD_CONFIGURABLE_MUTATION,
    ADD_SIMPLE_MUTATION,
    ADD_BUNDLE_MUTATION
} from '../ProductFullDetail/productFullDetail.gql';
import { gql, useMutation } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Iframe from 'react-iframe'


let data_value = 'A';

function updateDataValue(valeur) {
    data_value = valeur;
    console.log('UPDATE: '+data_value);
}

class ServiceDetailsEmployeurs extends Component{

    constructor () {
        super()
        this.state = {
            pageData: [],
            name: "React Component reload sample",
            reload: false
        }
    }

    refreshPage = () => {
        this.setState(
          {reload: true},
          () => this.setState({reload: false})
        )
      }

    submit() {
        this.setState({ name: "React Component Updated - " + new Date() });
     }

    onToggleLoop = (event) => {
        this.setState({loopActive: !this.state.loopActive})
        this.props.onToggleLoop()
    } 

    componentDidMount() {
        let pid = this.props.pid;
        let dataURL = "https://sherpagroupav.com/get_projects.php?email="+pid;
        fetch(dataURL)
          .then(res => res.json())
          .then(res => {
            this.setState({
                pageData: res
            })
          });        
    }



    render(){

        const ADD_TO_CUSTOM_PROJECT = gql`
        mutation($category_id: String!, $product_id: Int!) {
            MpBetterWishlistAddItem(
                input: { category_id: $category_id, product_id: $product_id }
            )
        }
        `;

        

        function AddToProject({item_id,uid}) {

            let input;

            const [addTodo, { data, loading, error }] = useMutation(ADD_TO_CUSTOM_PROJECT);
        
            if (loading) return (<button type="" className={classes.add_to_project}>ADDING TO PROJECT</button>);
            if (error) return `Submission error! ${error.message}`;

            function returnVal(sid) {
                var e = document.getElementById(sid);
                var value = e.options[e.selectedIndex].value;
                var text = e.options[e.selectedIndex].text;
                return value;
            }

            function pname(sid) {
                var e = document.getElementById(sid);
                var value = e.options[e.selectedIndex].value;
                var text = e.options[e.selectedIndex].text;
                return text;
            }
            

            return (
            <div>
                
                <form
                onSubmit={e => {
                    e.preventDefault();
                    
                    if(returnVal(uid) == 0 || returnVal(uid) == 1) {
                        window.alert('Please choose or create a project.');
                    } else {
                        
                        addTodo({ variables: { category_id: returnVal(uid) , product_id: item_id} });
                        window.alert('Product added to project '+pname(uid));
                    }
                }}
                > 
                <button type="submit" className={classes.add_to_project}>ADD TO PROJECT</button>
                </form>
            </div>
            
            );
        }

        const TOGGLE_LIKED_PHOTO = gql`
        mutation($category_name: String!) {
            MpBetterWishlistCreateCategory(input: { category_name: $category_name }) {
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

            function sortOptions(selectId) {
                var options = document.getElementById(selectId).options;
                var optionsArray = [];
                for (var i = 0; i < options.length; i++) {
                    optionsArray.push(options[i]);
                }
                optionsArray = optionsArray.sort(function (a, b) {           
                    return a.innerHTML.toLowerCase().charCodeAt(0) - b.innerHTML.toLowerCase().charCodeAt(0);    
                });
            
                for (var i = 0; i <= options.length; i++) {            
                    options[i] = optionsArray[i];
                }
                options[0].selected = true;
            }

            let input;

            let selectId = uid;
    
            const [addTodo, { data, loading, error }] = useMutation(TOGGLE_LIKED_PHOTO);
            const [selectValue, setSelectValue] = React.useState("");
            if (data) { 

                /*const newOption = document.createElement('option');
                const optionText = document.createTextNode(data.MpBetterWishlistCreateCategory.category_name);
                newOption.appendChild(optionText);
                newOption.setAttribute('value',data.MpBetterWishlistCreateCategory.category_id);
                
                const select = document.querySelector('select'); 
                select.appendChild(newOption);
     
                var options = select.options;
                for (var i = 0; i < options.length; i++) {
                if (options[i].value == inputs[index].id) {
                    options[i].selected = true;
                    break;
                }
                }*/

                document.getElementById('hidden_div').style.display='none';

                var inputs, index;

                inputs = document.getElementsByTagName('select');
                for (index = 0; index < inputs.length; ++index) {
                    console.log(inputs[index].id);
                    
                    var daySelect = document.getElementById(inputs[index].id);

                    if(inputs[index].id == inputs[index].id) {
                        daySelect.options[daySelect.options.length] = new Option(data.MpBetterWishlistCreateCategory.category_name,data.MpBetterWishlistCreateCategory.category_id,true,true);
                    } else {
                        daySelect.options[daySelect.options.length] = new Option(data.MpBetterWishlistCreateCategory.category_name,data.MpBetterWishlistCreateCategory.category_id,false,false);
                    }

                    //sortOptions(inputs[index].id);

                }

                //console.log(data.MpBetterWishlistCreateCategory.category_id)

            }
            if (loading) return 'Submitting...';
            if (error) return `Submission error! ${error.message}`;
    
            return (
              <div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addTodo({ variables: { category_name: input.value } });
                    input.value = '';
                    
                    window.alert('New category created.');
                    setSelectValue(999);
                  }}
                >
                    <input className={classes.project_input} type='text' ref={node => {input = node;}}/>
                    <input type='hidden' value={selectId} />
                    <button className={classes.project_button} type="submit">OK</button> 
                </form>
              </div>
            );
          }

          const Select = () => {
            const [selectValue, setSelectValue] = React.useState("");
            const onChange = (event) => {
              const value = event.target.value;
              setSelectValue(value);
              updateDataValue(value);
            }; 

            function makeid(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                let counter = 0;
                while (counter < length) {
                  result += characters.charAt(Math.floor(Math.random() * charactersLength));
                  counter += 1;
                }
                return result;
            }
              
            var uniqueId = makeid(15);

            return (
              <div>
                {/*<AddToProject item_id={this.props.item_id} uid={uniqueId} />
                <select onChange={onChange} className={classes.project_dropdown} id={uniqueId}>
                    <option defaultValue value="0">
                    Choose a project.
                    </option>
                    {this.state.pageData && this.state.pageData.map((e) => {
                    
                    if(!e.category_name.startsWith('ARCHIVE')) {
                        return (
                            <option value={e.category_id}>{e.category_name}</option>
                        );
                    }
                
                })}
                    <option value="1">Create a new project</option>
                    </select>
                    {selectValue &&  selectValue == 1 && ( 
                    <div id={"hidden_div"}>
                        <AddTodo uid={uniqueId}/>
                    </div>
                    )} */}
              </div>
            );
          };  

        const classes = useStyle(defaultClasses);

        return(
            <React.Fragment>

                <div>
                    
                    {/* <Select/>  */}                  
                </div>

            </React.Fragment>
        )
    }
}

const Wishlist = React.lazy(() => import('../MyWishlist/wishlist'));


// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {

    const [{ currentUser, isSignedIn }] = useUserContext();

    function openRegister() {
        document.getElementById('user_account').click();
    }

    const { email } = useDashboard();

    const { handleLinkClick, item } = useGalleryItem(props);
    const { style } = props;

    const [productName, setProductName] = useState('');
    let productUrlSuffix = '';
    if (item && item.url_suffix) {
        productUrlSuffix = item.url_suffix;
    }
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useProductFullDetail({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
        addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
        addSimpleCustomMutation: ADD_SIMPLE_CUSTOM_MUTATION,
        addBundleProductToCartMutation: ADD_BUNDLE_MUTATION,
        product: mapProduct(item)
    });
    const { handleAddToCart, success, errorMessage, isAddingItem } = talonProps;
    useEffect(() => {
        if (success && !isAddingItem) {
            addToast({
                type: 'info',
                message:
                    productName +
                    formatMessage({
                        id: 'cart.message',
                        defaultMessage: ' added to the cart.'
                    }),
                dismissable: true,
                timeout: 2000
            });
        }
        if (errorMessage && !isAddingItem) {
            addToast({
                type: 'error',
                message: errorMessage ? errorMessage : 'error',
                dismissable: true,
                timeout: 2000
            });
        }
    }, [
        addToast,
        success,
        errorMessage,
        isAddingItem,
        productName,
        formatMessage
    ]);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, price_range, small_image, url_key, id, stock_status, product_brand, productbrand, short_description, meta_title} = item;
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);
    let colorSwatchLength = 0;
    let itemElements;
    if (item.configurable_options) {
        item.configurable_options.forEach(configOptions => {
            if (configOptions.attribute_code == 'color') {
                colorSwatchLength = configOptions.values.length;
                itemElements = configOptions.values.map(swatches => {
                    const { label, value_index } = swatches;
                    const finalStyle = Object.assign({}, style, {
                        backgroundColor: label
                    });
                    const element = (
                        <div key={value_index}>
                            <Link
                                to={productLink}
                                className={classes.colors_inner}
                                style={finalStyle}
                            >
                                <FormattedMessage
                                    id={'item.colors_inner'}
                                    defaultMessage={'color name'}
                                />
                            </Link>
                        </div>
                    );
                    return element;
                });
            }
        });
    }

    const customPrice = 0;
    const customPricePercent = 0;

    const final_minimum_price =
    (price_range.minimum_price.final_price.value +
        customPrice +
        customPricePercent * price_range.minimum_price.final_price.value)*1;

    const final_regular_price =
    (price_range.minimum_price.regular_price.value +
        customPrice +
        customPricePercent * price_range.minimum_price.regular_price.value)*1;

    const final_maximum_price =
    price_range.maximum_price.final_price.value +
        customPrice +
        customPricePercent * price_range.maximum_price.final_price.value;

    const final_regular_price_max =
    price_range.maximum_price.regular_price.value +
        customPrice +
        customPricePercent * price_range.maximum_price.regular_price.value; 

    const discount_percent = ((1 - (final_minimum_price/final_regular_price)).toFixed(2)) * 100;

    function openLoginBox() {
        document.getElementById('user_account').click();
    }

    let data_value = '';

    const [selectValue2, setSelectValue2] = React.useState("");
    const onChange = (event) => {
        const value = event.target.value;
        if(value==1) {
            setSelectValue(value);
        } else {
            setSelectValue(value);
        }
        
    };

    function updateDataValue(valeur) {
        data_value = valeur;
        console.log('UPDATE: '+data_value);
    }

    function getDataValue() {
        console.log('REQ: '+data_value);
        return data_value;
    }

    let discount_date = new Date(item.special_to_date);

    const ADD_TO_CUSTOM_PROJECT = gql`
    mutation($category_id: String!, $product_id: Int!) {
        MpBetterWishlistAddItem(
            input: { category_id: $category_id, product_id: $product_id }
        )
    }
    `;

    

    function AddToProject({item_id}) {

        let input;

        const [addTodo, { data, loading, error }] = useMutation(ADD_TO_CUSTOM_PROJECT);
      
        if (loading) return (<button type="" className={classes.add_to_project}>ADDING TO PROJECT</button>);
        if (error) return `Submission error! ${error.message}`;

        console.log(data);

        return (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                
                addTodo({ variables: { category_id: getDataValue() , product_id: item_id} });
                window.alert('Product added to project.');
                
              }}
            > 
              <button type="submit" className={classes.add_to_project}>ADD TO PROJECT</button>
            </form>
          </div>
          
        );
      }

    

    const GET_WL_DETAILS = gql`
    query {
        MpBetterWishlistGetCategories(is_items: true) {
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

    

    const Select = () => {
        const [selectValue, setSelectValue] = React.useState("");
        const onChange = (event) => {
          const value = event.target.value;
          setSelectValue(value);
          updateDataValue(value);
        }; 

        const { data, loading } = useQuery(GET_WL_DETAILS, {
            //context: { headers: { authorization: `Bearer ${token}` } },
            headers: {
                authorization:
                    'bearer xxx',
              },
            fetchPolicy: 'no-cache',
            variables: {}});

        if (loading) {
            return <p>Loading ...</p>
        }  
          
        return (
          <div>
            
            
            
          </div>
        );
      };

    const BWL = () => {


        const { data, loading } = useQuery(GET_WL_DETAILS, {
            fetchPolicy: 'network-only',
            variables: {
            }});

        if (loading) {
            return <p>Loading ...</p>
        }
        
        return (
                <> 
                {/*<select onChange={onChange} className={classes.project_dropdown}>
                <option value="2">Choose a project</option>
                {data.MpBetterWishlistGetCategories && data.MpBetterWishlistGetCategories.map((e) => {
                    console.log('Calvert');
                    console.log("LNG "+e.items.length > 0)
                    if(e.items.length > 0) {
                        return (
                            <option value={e.category_id}>{e.category_name}</option>
                        );
                    }
                    
                })}    
                <option value="1">Create a new project</option>
            </select>   */}
                
                </>
          );
      };

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.noo_product_image}>
                {discount_percent > 0 && email && (
                    <div className={classes.priceTag}><b>{discount_percent}% Off{item.special_to_date && (<> until {(discount_date.toDateString().split(' ').slice(1).join(' '))}</>)}</b></div>
                )}



                <Link
                    onClick={handleLinkClick}
                    to={productLink}
                    className={classes.images}
                >
                    <Image
                        alt={name}
                        classes={{
                            image: classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        resource={smallImageURL}
                        widths={IMAGE_WIDTHS}
                    />
                </Link>
            </div>
            <div className={classes.noo_details_wrapper}>
                <p className={classes.product_name}>
                    <Link
                        onClick={handleLinkClick}
                        to={productLink}
                        className={classes.name}
                    > 
                        Part # {item.sku}
                    </Link>
                </p>
                <p className={classes.product_name}>
                    <Link
                        onClick={handleLinkClick}
                        to={productLink}
                        className={classes.name}
                    > 
                        <span>{name.length > 55 ? name.substring(0, 52) + " [...]" : name}</span>
                    </Link>
                </p>

                
                
                <div
                    className={classes.vendor_price_wrap + ' ' + classes.price}
                >
                    {email ? (
                        <div> 
                            
                            

                            <p className={classes.total_available}>Total available: {item.totalavailable}</p>
                            
                            
                            {final_minimum_price != final_regular_price && (
                                <>
                                    {/*<p><b>Special price</b></p>
                                    {item.special_from_date && (
                                        <p>From: {item.special_from_date.slice(0, -8)}</p>
                                    )}
                                    {item.special_to_date && (
                                        <p>To: {item.special_to_date.slice(0, -8)}</p>
                                    )} */}
                                    <b className={classes.total_available_b}>YOUR COST&nbsp;&nbsp;</b>
                                    <span className={classes.productPrice+ ' ' + classes.greenprice }>
                                        <Price
                                            value={(price_range.maximum_price.final_price.value)*1}
                                            currencyCode={
                                                price_range.maximum_price.regular_price.currency
                                            }
                                        />
                                    </span>
                                    <span
                                        className={
                                            classes.regularprice+ ' ' + classes.discountedprice 
                                        }
                                    >
                                        
                                        <Price
                                            currencyCode={
                                                price_range.minimum_price.regular_price.currency
                                            }
                                            value={final_regular_price}
                                        />
                                        
                                    </span>
                                </>
                            )}
                            {final_minimum_price == final_regular_price && item.sku.substring(0, 3) != 'SA-' && (
                                <>
                                    
                                    <b className={classes.total_available_b}>YOUR COST&nbsp;&nbsp;</b>
                                    
                                        <Price
                                            value={price_range.maximum_price.final_price.value}
                                            currencyCode={
                                                price_range.maximum_price.regular_price.currency
                                            }
                                        />
                                    
                                </>
                            )}
                            {item.sku.substring(0, 3) == 'SA-' && (
                                <>
                                    
                                    <b className={classes.total_available_b}>YOUR COST : See Price List</b>
                                    
                                        
                                    
                                </>
                            )}
                            {item.sku.substring(0, 3) != 'SA-' && (
                            <p>
                                <b className={classes.total_available_b}>MSRP&nbsp;&nbsp;</b>
                                
                                <Price
                                    value={item.msrp_sherpa2}
                                    currencyCode={
                                        price_range.maximum_price.regular_price.currency
                                    }
                                />
                            </p>
                            )}
                        </div>
                    ) : (
                        <div>
                           
                        </div>
                        
                    )}
                    
                </div>
                
                <div className={defaultClasses.colors_stars_wrap}>
                    <div className={defaultClasses.colors_wrap}>
                        {itemElements}
                    </div>
                    <div>
                        {colorSwatchLength > 3 && (
                            <Link
                                to={productLink}
                                className={classes.extra_colors}
                            >
                                <FormattedMessage
                                    id={'item.extra_colors'}
                                    defaultMessage={'+3'}
                                />
                            </Link>
                        )}
                    </div>
                </div>
                <div
                    className={
                        defaultClasses.add_to_cart_Wrap +
                        ' ' +
                        'position-relative'
                    }
                >
                    {email ? (
                        <div>
                    <div className={'c'+item.id+' '+classes.qty_selector}><QuantityPicker min={1} value={1} width='65%'/></div>      
                    <div className={classes.add_to_cart_btn}>
                        {item.__typename == 'SimpleProduct' &&
                            stock_status == 'IN_STOCK' &&
                            item.options == null && (
                                
                                    <button

                                        onClick={() => {
                                            console.log(item);
                                            setProductName(item.name),
                                            handleAddToCart({
                                                quantity: document.querySelector('.c'+item.id).querySelector('.quantity-display').value,
                                                item
                                            });
                                        }}

                                        /*onClick={() => {
                                            setProductName(item.name),
                                            handleAddToCart(item);
                                        }} */
                                    >
                                        <FormattedMessage
                                            id={'item.add_to_cart_btn'}
                                            defaultMessage={'ADD TO CART'}
                                        />
                                    </button>
                                
                            )}
                        {item.__typename == 'SimpleProduct' &&
                            stock_status == 'IN_STOCK' &&
                            item.options !== null && (
                                <Link to={resourceUrl(productLink)}>
                                    <FormattedMessage
                                        id={
                                            'item.add_to_cart_btn_SimpleProduct'
                                        }
                                        defaultMessage={'ADD TO CART'}
                                    />
                                </Link>
                            )}
                        {item.__typename == 'SimpleProduct' &&
                            stock_status != 'IN_STOCK' && (
                                <Link to={resourceUrl(productLink)}>
                                    <FormattedMessage
                                        id={
                                            'item.add_to_cart_btn_SimpleProduct'
                                        }
                                        defaultMessage={'ADD TO CART'}
                                    />
                                </Link>
 
                            )}
                        {item.__typename != 'SimpleProduct' && (
                            <Link to={resourceUrl(productLink)}>
                                <FormattedMessage
                                    id={
                                        'item.add_to_cart_btn_ConfigurableProduct'
                                    }
                                    defaultMessage={'ADD TO CART'}
                                />
                            </Link>
                        )}
                        {isAddingItem && item.name == productName && (
                            <div
                                className={
                                    proClasses.modal +
                                    ' ' +
                                    proClasses.modal_active +
                                    ' ' +
                                    defaultClasses.modal_active +
                                    ' ' +
                                    proClasses.galler_modal_active
                                }
                            >
                                <div className={proClasses.loader_div}>
                                    <div className={proClasses.ball_pulse}>
                                        <div />
                                        <div />
                                        <div />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={classes.add_to_cart_btn}>
                        {item.__typename == 'SimpleProduct' &&
                            stock_status == 'IN_STOCK' &&
                            item.options == null && (
                                <div>
                                    
                                    
                                    
                                </div>
                                
                            )}
                        {item.__typename == 'SimpleProduct' &&
                            stock_status == 'IN_STOCK' &&
                            item.options !== null && (
                                <Link to={resourceUrl(productLink)}>
                                    <FormattedMessage
                                        id={
                                            'item.add_to_cart_btn_SimpleProduct'
                                        }
                                        defaultMessage={'ADD TO CART'}
                                    />
                                </Link>
                            )}
                        {item.__typename == 'SimpleProduct' &&
                            stock_status != 'IN_STOCK' && (
                                <Link to={resourceUrl(productLink)}>
                                    <FormattedMessage
                                        id={
                                            'item.add_to_cart_btn_SimpleProduct'
                                        }
                                        defaultMessage={'ADD TO CART'}
                                    />
                                </Link>
 
                            )}
                        {item.__typename != 'SimpleProduct' && (
                            <Link to={resourceUrl(productLink)}>
                                <FormattedMessage
                                    id={
                                        'item.add_to_cart_btn_ConfigurableProduct'
                                    }
                                    defaultMessage={'ADD TO CART'}
                                />
                            </Link>
                        )}
                        {isAddingItem && item.name == productName && (
                            <div
                                className={
                                    proClasses.modal +
                                    ' ' +
                                    proClasses.modal_active +
                                    ' ' +
                                    defaultClasses.modal_active +
                                    ' ' +
                                    proClasses.galler_modal_active
                                }
                            >
                                <div className={proClasses.loader_div}>
                                    <div className={proClasses.ball_pulse}>
                                        <div />
                                        <div />
                                        <div />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    </div>
                    ) : (
                        <p>&nbsp;</p>
                    )}
                    {/* End custom add to cart */}

                    {/* <CompareButton id={id} /> */}
                </div>

                    {email ? (
                        <div> 
                            {/* <Select /> */}
                            
                            <ServiceDetailsEmployeurs pid={email} item_id={item.id}/>
                            {/* <BWL /> */}
                            
                        </div>
                    ) : (
                        <>
                        <div className={classes.boxlink}><a style={{cursor:'pointer'}} onClick={openLoginBox}>Login or Register for an Account</a></div>
                        
                        </>
                    )}

               
            </div>
        </div>
    );
    
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    })
    // storeConfig: shape({
    //     magento_wishlist_general_is_enabled: string.isRequired,
    //     product_url_suffix: string.isRequired
    // })
};

export default GalleryItem;
