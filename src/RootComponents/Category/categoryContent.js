import React, {
    Fragment,
    Suspense,
    useMemo,
    Component,
    useEffect
} from 'react';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';
import { useCategoryContent } from '../../peregrine/lib/talons/RootComponents/Category';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';
import { useStyle } from '../../classify';
import Breadcrumbs from '../../components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '../../components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '../../components/FilterSidebar';
import Gallery, { GalleryShimmer } from '../../components/Gallery';
import { StoreTitle } from '../../components/Head';
import Pagination from '../../components/Pagination';
import ProductSort, { ProductSortShimmer } from '../../components/ProductSort';
import RichContent from '../../components/RichContent';
import Shimmer from '../../components/Shimmer';
import defaultClasses from './category.css';
import NoProductsFound from './NoProductsFound';
import { useFeaturedProducts } from '../../peregrine/lib/talons/FeaturedProduct/useFeaturedProduct';
import FeaturedQuery from '../../queries/featuredProducts.graphql';
import { useDashboard } from '../../peregrine/lib/talons/MyAccount/useDashboard';
import axios from 'axios';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client';
import cart from '@magento/peregrine/lib/context/cart';

class OrderTotal extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }

    componentDidMount() {
        let orderNumber = this.props.cid;
        let email = this.props.email;
        let dataURL =
            'https://data.sherpagroupav.com/get_permissions.php?email=' +
            email +
            '&cid=' +
            orderNumber;
        console.log('DATA URL');
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

        if (this.props.email && projectname == 0) {
            window.location.href = '/brand-access';
            return <>Exiting</>;
        } else {
            return <></>;
        }
    }
}

class TriggerOpen extends Component {
    constructor() {
        super();
        this.state = {
            pageData: []
        };
    }
    componentDidMount() {
        document.getElementById('user_account').click();
    }
    render() {
        return <></>;
    }
}

const FilterModal = React.lazy(() => import('../../components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('../../components/FilterSidebar')
);
const SliderProduct = React.lazy(() => import('./sliderProduct'));

const CategoryContent = props => {
    const { mobileView } = useMobile();
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize
    } = props;

    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        categoryName,
        categoryDescription,
        filters,
        items,
        children,
        totalCount,
        totalPagesFromData
    } = talonProps;

    const featuredProps = useFeaturedProducts({
        query: FeaturedQuery,
        category_id: categoryId
    });

    const { featuredProduct, loading } = featuredProps;

    const classes = useStyle(defaultClasses, props.classes);

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    // const maybeSortContainer = shouldShowSortButtons ? (
    //     <SortedByContainer currentSort={currentSort} />
    // ) : shouldShowSortShimmer ? (
    //     <SortedByContainerShimmer />
    // ) : null;

    let lng = '';
    if (document.getElementById('currentLng') != null) {
        lng = document.getElementById('currentLng').innerHTML;
    }
    let activeLng = '';
    if (lng == 'Français') {
        activeLng = '-fr';
    } else {
        activeLng = '';
    }

    const categoryResultsHeading =
        totalCount > 0 ? (
            <FormattedMessage
                id={'categoryContent.resultCount'}
                values={{
                    count: totalCount
                }}
                defaultMessage={'{count} Results'}
            />
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery items={items} />
        ) : (
            <GalleryShimmer items={items} />
        );

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                {!loading && featuredProduct && (
                    <Suspense fallback={''}>
                        <SliderProduct
                            featuredData={featuredProduct}
                            classes={classes}
                        />
                    </Suspense>
                )}
                <div className={classes.pagination}>{pagination}</div>
                <section className={classes.gallery}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [
        categoryId,
        classes,
        featuredProduct,
        isLoading,
        items,
        loading,
        pageControl,
        totalPagesFromData
    ]);

    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;
    const banner =
        data && data.category && data.category.image ? (
            <img
                alt="categoryBanner"
                src={data.category.image}
                className={'img-fluid' + ' ' + classes.categoyrpage_banner}
            />
        ) : (
            ''
        );

    const catId =
        data && data.category && data.category.id ? data.category.id : 0;

    const [{ isSignedIn }] = useUserContext();

    /*const GET_WL_DETAILS = gql`
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

    const BWL = () => {

        const { data, loading } = useQuery(GET_WL_DETAILS, {
            fetchPolicy: 'network-only',
            variables: {
            }});

        if (loading) {
            return <p>Loading ...</p>
        }


        return (
            
            <div className="App">
              {data.MpBetterWishlistGetCategories && data.MpBetterWishlistGetCategories.map((e) => {
                return (
                    <div className='row'>
                    {e.items.map((s) => {
                      return (
                        
                          <div className='col-lg-3 col-md-6 col-sm-6 col-xs-12'>
                            <div className={classes.boxcategory}>
                            <p>{e.category_name}</p>
                            <p>{s.product_id}</p>
                            <p>{s.qty}</p>
                            </div>
                          </div>
                         
                        
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
      };
*/

    const GET_PAGE_SIZE = gql`
        query($filter: CategoryFilterInput) {
            categoryList(filters: $filter) {
                children_count
                children {
                    id
                    level
                    name
                    path
                    url_path
                    url_key
                    image
                    description
                    manufacturer_link
                }
            }
        }
    `;

    let exclude = 1;

    const LinkList = () => {
        let categoryId = catId.toString();

        console.log('categoryId: ' + categoryId);

        const { data, loading } = useQuery(GET_PAGE_SIZE, {
            variables: {
                filter: {
                    ids: {
                        in: categoryId
                    }
                }
            },
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        });

        if (loading) {
            return <p></p>;
        }

        let childrenCount = data.categoryList.length;

        if (catId == 135 && !isSignedIn) {
            exclude = 1;
        } else {
            exclude = 0;
        }
        const { email } = useDashboard();

        let lng = '';
        if (document.getElementById('currentLng') != null) {
            lng = document.getElementById('currentLng').innerHTML;
        }
        let activeLng = '';
        if (lng == 'Français') {
            activeLng = '-fr';
        } else {
            activeLng = '';
        }
        console.log('**********');
        console.log(data);

        return (
            <div className="App">
                {isSignedIn ? <OrderTotal cid={catId} email={email} /> : <></>}

                {exclude == 0 &&
                    data.categoryList &&
                    data.categoryList.map(e => {
                        return (
                            <div className="row">
                                {e.children.map(s => {
                                    return (
                                        <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                            <div
                                                className={classes.boxcategory}
                                            >
                                                <p>{s.name}</p>
                                                {categoryId == 42 ? (
                                                    <div
                                                        className={
                                                            classes.containerImgBox
                                                        }
                                                    >
                                                        <a
                                                            href={
                                                                '/' + s.url_path
                                                            }
                                                        >
                                                            <img
                                                                className={
                                                                    classes.imgBox
                                                                }
                                                                src={s.image}
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                <div
                                                    className={classes.boxlink}
                                                >
                                                    <a href={'/' + s.url_path + '?page=1'}>
                                                        <FormattedMessage
                                                            id={
                                                                'categoryContent.viewProducts'
                                                            }
                                                            defaultMessage={
                                                                'View products list'
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                                {categoryId == 42 &&
                                                s.manufacturer_link &&
                                                activeLng == '' && isSignedIn ? (
                                                    <div
                                                        className={
                                                            classes.boxlink
                                                        }
                                                    >
                                                        <a
                                                            target="_blank"
                                                            href={
                                                                s.manufacturer_link
                                                            }
                                                        >
                                                            <FormattedMessage
                                                                id={
                                                                    'categoryContent.brandWebsite'
                                                                }
                                                                defaultMessage={
                                                                    'Brand Website'
                                                                }
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                {categoryId == 42 &&
                                                s.description &&
                                                isSignedIn ? (
                                                    <div
                                                        className={
                                                            classes.boxlink
                                                        }
                                                    >
                                                        <a
                                                            target="_blank"
                                                            href={
                                                                'https://assets.sherpagroupav.com/pdf/' +
                                                                s.description
                                                            }
                                                        >
                                                            <FormattedMessage
                                                                id={
                                                                    'categoryContent.priceList'
                                                                }
                                                                defaultMessage={
                                                                    'Price List'
                                                                }
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
            </div>
        );
    };

    function openLoginBox() {
        console.log('Open the shit');
        document.getElementById('user_account').click();
    }

    if (catId == 135 && !isSignedIn && !isLoading) {
        exclude = 1;
    } else {
        exclude = 0;
    }

    const Banner = React.lazy(() => import('/src/components/CedHome/banner'));
    const categoryBannerIdentifierHome = 'banner_' + catId;
    const categoryBannerIdentifierPromotion = 'promotion-register' + activeLng;
    let showCategoryBanners = true;

    return (
        <Fragment>
            <div className={'container'}>
                <Breadcrumbs categoryId={categoryId} />
                <StoreTitle>{categoryName}</StoreTitle>
                <article className={classes.root}>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 className={classes.title}>
                                <div className={classes.categoryTitle}>
                                    {categoryTitle}
                                </div>
                                <div className={classes.categoryInfo}>
                                    ({categoryResultsHeading})
                                </div>
                            </h1>
                            <Suspense fallback={''}>
                                <Banner
                                    identifier={categoryBannerIdentifierHome}
                                    showBanner={showCategoryBanners}
                                />
                            </Suspense>
                            {isSignedIn && categoryDescription != null ? (
                                <div className={classes.downloadboxlink}>
                                    <a
                                        href={`https://assets.sherpagroupav.com/pdf/${categoryDescription}`}
                                        target="_blank"
                                    >
                                        Download price list
                                    </a>
                                </div>
                            ) : (
                                ''
                            )}
                            {!isSignedIn && catId == 135 ? (
                                <div>
                                    <TriggerOpen />
                                    <Suspense fallback={''}>
                                        <Banner
                                            identifier={
                                                categoryBannerIdentifierPromotion
                                            }
                                            showBanner={showCategoryBanners}
                                        />
                                    </Suspense>
                                    <div className={classes.boxlinkCustom}>
                                        <a
                                            style={{ cursor: 'pointer' }}
                                            onClick={openLoginBox}
                                        >
                                            <FormattedMessage
                                                id={'item.loginMessage'}
                                                defaultMessage={
                                                    'Login or Register for an Account'
                                                }
                                            />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-right">
                            {banner}
                        </div>
                    </div>
                    <LinkList />
                    {catId != 42 && catId != 382 && exclude == 0 ? (
                        <div className={classes.contentWrapper}>
                            {!mobileView && (
                                <div className={classes.sidebar}>
                                    {maybeSortButton}
                                    <Suspense
                                        fallback={<FilterSidebarShimmer />}
                                    >
                                        {sidebar}
                                    </Suspense>
                                </div>
                            )}
                            <div className={classes.categoryContent}>
                                {!mobileView && (
                                    <div>
                                        <div className={classes.headerButtons}>
                                            {maybeFilterButtons}
                                            {/* {maybeSortButton} */}
                                        </div>
                                        {/* {maybeSortContainer} */}
                                    </div>
                                )}
                                {mobileView && (
                                    <div
                                        className={classes.mobile_headerButtons}
                                    >
                                        <div
                                            className={
                                                classes.mobile_headerButtons_inner
                                            }
                                        >
                                            {maybeFilterButtons}
                                            <div
                                                className={
                                                    classes.sort_btn_mobile
                                                }
                                            >
                                                {maybeSortButton}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {content}

                                <Suspense fallback={null}>
                                    {filtersModal}
                                </Suspense>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </article>
            </div>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        pagination: string,
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
