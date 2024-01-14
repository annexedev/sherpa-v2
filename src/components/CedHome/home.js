import React, { Suspense, useEffect, useState, Component } from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import defaultClasses from './home.css';
import { useSlider } from '../../peregrine/lib/talons/Slider/useSlider';
import GET_SLIDER_DATA from '../../queries/getSliderDetails.graphql';
import { Link, resourceUrl } from 'src/drivers';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';
import Image from '../Image';
import { useIntl } from 'react-intl';
import BannerSkelton from './bannerSkeleton';
import ReactDOM from 'react-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const Banner = React.lazy(() => import('./banner'));
const SliderProduct = React.lazy(() => import('./sliderProduct'));

const Home = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [scrollFlag, setScrollFlag] = useState(false);
    const handleClick = () => {
        if (!scrollFlag) setScrollFlag(true);
    };
    useEffect(() => {
        document.addEventListener('scroll', handleClick);
        return () => {
            document.removeEventListener('scroll', handleClick);
        };
    });
    /*const talonProps = useSlider({
        query: GET_SLIDER_DATA
    });*/

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

    const { HomepageConfig } = props;

    let showCategoryIcons = false;
    let showCategoryBanners = false;
    let showOfferBanners = false;
    let showHomeSlider = false;
    let showTrendingProducts = false;
    let showLatestProducts = false;
    for (var i = 0; i < HomepageConfig.length; i++) {
        if (HomepageConfig[i]['name'] == 'categories_icon_block')
            var catIconIdentifier = HomepageConfig[i]['value'];
        if (HomepageConfig[i]['name'] == 'categories_banner_block')
            var categoryBannerIdentifier = HomepageConfig[i]['value'];
        if (HomepageConfig[i]['name'] == 'offer_banner_block')
            var offerBannersIdentifier = HomepageConfig[i]['value'];
        if (HomepageConfig[i]['name'] == 'show_trending_products')
            showTrendingProducts = parseInt(HomepageConfig[i]['value']);
        if (HomepageConfig[i]['name'] == 'show_latest_products')
            showLatestProducts = parseInt(HomepageConfig[i]['value']);
        if (HomepageConfig[i]['name'] == 'show_category_icon')
            showCategoryIcons = parseInt(HomepageConfig[i]['value']);
        if (HomepageConfig[i]['name'] == 'show_category_banner')
            showCategoryBanners = parseInt(HomepageConfig[i]['value']);
        if (HomepageConfig[i]['name'] == 'show_offer_banner')
            showOfferBanners = parseInt(HomepageConfig[i]['value']);
        if (HomepageConfig[i]['name'] == 'show_home_slider')
            showHomeSlider = parseInt(HomepageConfig[i]['value']);
    }

    //const { sliderData } = talonProps;
    const { mobileView } = useMobile();
    let sliderImgWidth = 1351;
    if (mobileView) {
        sliderImgWidth = screen.availWidth;
    }
    const { formatMessage } = useIntl();
    const bannerSkelton = <BannerSkelton mobileView={mobileView} />;

    const categoryBannerIdentifierHome = 'home_banners';

    var arr = [];
    while (arr.length < 3) {
        var r = Math.floor(Math.random() * 5) + 1;
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    //console.log(arr[0]);

    const desktopsliderIdentifier1 = 'homepage_desktop_banner_' + arr[0];
    const desktopsliderIdentifier2 = 'homepage_desktop_banner_' + arr[1];
    const desktopsliderIdentifier3 = 'homepage_desktop_banner_' + arr[2];

    const mobilesliderIdentifier1 = 'homepage_mobile_banner_' + arr[0];
    const mobilesliderIdentifier2 = 'homepage_mobile_banner_' + arr[1];
    const mobilesliderIdentifier3 = 'homepage_mobile_banner_' + arr[2];

    return (
        <React.Fragment>
            <div>
                {!mobileView && (
                    <React.Suspense fallback={null}>
                        <Carousel
                            showThumbs={false}
                            autoPlay={true}
                            showStatus={false}
                            infiniteLoop={true}
                            interval={6000}
                        >
                            <div>
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={
                                            desktopsliderIdentifier1 + activeLng
                                        }
                                        showBanner={showOfferBanners}
                                    />
                                </Suspense>
                            </div>
                            <div>
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={
                                            desktopsliderIdentifier2 + activeLng
                                        }
                                        showBanner={showOfferBanners}
                                    />
                                </Suspense>
                            </div>
                            <div>
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={
                                            desktopsliderIdentifier3 + activeLng
                                        }
                                        showBanner={showOfferBanners}
                                    />
                                </Suspense>
                            </div>
                        </Carousel>
                    </React.Suspense>
                )}

                {mobileView && (
                    <React.Suspense fallback={null}>
                        <Carousel
                            showThumbs={false}
                            autoPlay={true}
                            showStatus={false}
                            infiniteLoop={true}
                            interval={6000}
                        >
                            <div>
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={
                                            mobilesliderIdentifier1 + activeLng
                                        }
                                        showBanner={showOfferBanners}
                                    />
                                </Suspense>
                            </div>
                            <div>
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={
                                            mobilesliderIdentifier2 + activeLng
                                        }
                                        showBanner={showOfferBanners}
                                    />
                                </Suspense>
                            </div>
                            <div>
                                <Suspense fallback={''}>
                                    <Banner
                                        identifier={
                                            mobilesliderIdentifier3 + activeLng
                                        }
                                        showBanner={showOfferBanners}
                                    />
                                </Suspense>
                            </div>
                        </Carousel>
                    </React.Suspense>
                )}

                {/* features block */}
                {showOfferBanners != 0 && (
                    <React.Suspense fallback={null}>
                        <section
                            className={
                                defaultClasses.homepage_sections +
                                ' ' +
                                defaultClasses.feature_block
                            }
                        >
                            <Suspense fallback={''}>
                                <Banner
                                    identifier={
                                        offerBannersIdentifier + activeLng
                                    }
                                    showBanner={showOfferBanners}
                                />
                            </Suspense>
                        </section>
                    </React.Suspense>
                )}
                {/* features block end */}

                {/* mid banner section start */}
                {showCategoryBanners != 0 && (
                    <React.Suspense fallback={null}>
                        <section
                            className={
                                defaultClasses.homepage_sections +
                                ' ' +
                                defaultClasses.static_blocks +
                                ' ' +
                                defaultClasses.mid_banner_sec_wrap +
                                ' ' +
                                defaultClasses.homepage_widget_container
                            }
                        >
                            <Suspense fallback={''}>
                                <Banner
                                    identifier={
                                        categoryBannerIdentifierHome + activeLng
                                    }
                                    showBanner={showCategoryBanners}
                                />
                            </Suspense>
                        </section>
                    </React.Suspense>
                )}
                {/* mid banner section END */}

                {/* top category section */}
                {showCategoryIcons != 0 && (
                    <div
                        className={
                            defaultClasses.homepage_sections +
                            ' ' +
                            defaultClasses.our_cat_section +
                            ' ' +
                            defaultClasses.homepage_widget_container
                        }
                    >
                        <Suspense fallback={bannerSkelton}>
                            <Banner
                                identifier={catIconIdentifier + activeLng}
                                showBanner={showCategoryIcons}
                            />
                        </Suspense>
                        <div className={defaultClasses.button_new}>
                            <div>
                                {activeLng == '-fr' && (
                                    <>
                                        <a href="/brands-sherpa">VOIR TOUS</a>
                                    </>
                                )}
                                {activeLng == '' && (
                                    <>
                                        <a href="/brands-sherpa">SEE ALL</a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* top category section end */}

                {/* Latest product section */}
                {showLatestProducts && scrollFlag && (
                    <Suspense fallback={''}>
                        <SliderProduct
                            showLinkedProduct={showLatestProducts}
                            type="Latest Product"
                            name={formatMessage({
                                id: 'home.latest',
                                defaultMessage: 'INSTALLER ESSENTIALS'
                            })}
                            classes={classes}
                        />
                    </Suspense>
                )}

                {/* Latest product section end */}

                {/* mid banner section start */}
                {showCategoryBanners != 0 && scrollFlag && (
                    <section
                        className={
                            defaultClasses.homepage_sections +
                            ' ' +
                            defaultClasses.static_blocks +
                            ' ' +
                            defaultClasses.mid_banner_sec_wrap +
                            ' ' +
                            defaultClasses.homepage_widget_container
                        }
                    >
                        <Suspense fallback={''}>
                            <Banner
                                identifier={
                                    categoryBannerIdentifier + activeLng
                                }
                                showBanner={showCategoryBanners}
                            />
                        </Suspense>
                    </section>
                )}
                {/* mid banner section END */}

                {/* Trending product section  */}
                {/* {showTrendingProducts && scrollFlag && (
                    <Suspense fallback={''}>
                        <SliderProduct
                            showLinkedProduct={showTrendingProducts}
                            type="BestSeller Product"
                            name={formatMessage({
                                id: 'home.bestseller',
                                defaultMessage: 'BestSeller Product'
                            })}
                            classes={classes}
                        />
                    </Suspense>
                )} */}

                {/* Trending product section end */}
            </div>
        </React.Fragment>
    );
};

Home.propTypes = {
    classes: shape({
        copyright: string,
        root: string,
        tile: string,
        tileBody: string,
        tileTitle: string
    })
};

export default Home;
