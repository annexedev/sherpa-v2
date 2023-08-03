import React, { Suspense, useEffect, useState } from 'react';
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
    const talonProps = useSlider({
        query: GET_SLIDER_DATA
    });

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

    const { sliderData } = talonProps;

    const { mobileView } = useMobile();
    let sliderImgWidth = 1351;
    if (mobileView) {
        sliderImgWidth = screen.availWidth;
    }
    const { formatMessage } = useIntl();
    const bannerSkelton = <BannerSkelton mobileView={mobileView} />;
    return (
        <React.Fragment>
            <div>
                {showHomeSlider != 0 && typeof sliderData != 'undefined' && (
                    <div className={classes.section_banner}>
                        <div
                            id="scroll"
                            className="carousel slide"
                            data-ride="carousel"
                        >
                            <div className="carousel-inner">
                                {sliderData.allSlides.map(
                                    (value, index, ClassDetails) => {
                                        var imgName = value.image
                                            .split('/')
                                            .pop();
                                        var image = resourceUrl(value.image, {
                                            type: 'image-custom',
                                            width: sliderImgWidth,
                                            quality: '85'
                                        });

                                        if (index == 0) {
                                            ClassDetails =
                                                'carousel-item active';
                                        } else {
                                            ClassDetails = 'carousel-item';
                                        }
                                        let url = '/';
                                        if (value.url) {
                                            url = value.url;
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className={ClassDetails}
                                            >
                                                <Link
                                                    className={'d-block'}
                                                    to={resourceUrl(url)}
                                                >
                                                    <Image
                                                        alt={imgName}
                                                        title="banner image"
                                                        classes={{
                                                            image:
                                                                classes.image,
                                                            root:
                                                                classes.imageContainer
                                                        }}
                                                        width={sliderImgWidth}
                                                        height="525"
                                                        src={image}
                                                        loading="eager"
                                                    />
                                                </Link>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <a
                                className="carousel-control-prev"
                                href="#scroll"
                                role="button"
                                data-slide="prev"
                                aria-label="previous"
                            >
                                <span aria-label="slider Previous btn">‹</span>
                            </a>
                            <a
                                className="carousel-control-next"
                                href="#scroll"
                                role="button"
                                data-slide="next"
                                aria-label="next"
                            >
                                <span aria-label="slider next btn">›</span>
                            </a>
                        </div>
                    </div>
                )}

                {/* top category section */}
                {showCategoryIcons != 0 && (
                    <div
                        className={
                            defaultClasses.homepage_sections +
                            ' ' +
                            defaultClasses.our_cat_section
                        }
                    >
                        <Suspense fallback={bannerSkelton}>
                            <Banner
                                identifier={catIconIdentifier}
                                showBanner={showCategoryIcons}
                            />
                        </Suspense>
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
                                defaultMessage: 'Latest Product'
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
                            defaultClasses.mid_banner_sec_wrap
                        }
                    >
                        <Suspense fallback={''}>
                            <Banner
                                identifier={categoryBannerIdentifier}
                                showBanner={showCategoryBanners}
                            />
                        </Suspense>
                    </section>
                )}
                {/* mid banner section END */}

                {/* Trending product section  */}
                {showTrendingProducts && scrollFlag && (
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
                )}

                {/* Trending product section end */}

                {/* features block */}
                {showOfferBanners != 0 && scrollFlag && (
                    <section
                        className={
                            defaultClasses.homepage_sections +
                            ' ' +
                            defaultClasses.feature_block
                        }
                    >
                        <Suspense fallback={''}>
                            <Banner
                                identifier={offerBannersIdentifier}
                                showBanner={showOfferBanners}
                            />
                        </Suspense>
                    </section>
                )}
                {/* features block end */}
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
