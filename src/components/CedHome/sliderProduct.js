import React, { useMemo } from 'react';
import { mergeClasses } from '../../classify';
import {
    useGetScopeCache,
    useSliderProducts
} from '../../peregrine/lib/talons/Home/useHome';
import GET_LATESTPRODUCTS_DATA from '../../queries/getLatestProducts.graphql';
import GET_BESTSELLER_DATA from '../../queries/getBestSeller.graphql';
import defaultClasses from './home.css';
import Product from './product';
import OwlCarousel from 'react-owl-carousel';

export default function SliderProduct(props) {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { showLinkedProduct, type, name } = props;
    const responsive1 = {
        0: {
            items: 2
        },
        450: {
            items: 2
        },
        600: {
            items: 4
        },
        1000: {
            items: 5
        }
    };

    const { config } = useGetScopeCache();

    const { sliderProduct } = useSliderProducts({
        showProducts: showLinkedProduct,
        query:
            (type == 'Latest Product' ? GET_LATESTPRODUCTS_DATA : '') ||
            (type == 'BestSeller Product' ? GET_BESTSELLER_DATA : '')
    });

    const productComponents = useMemo(
        () =>
            sliderProduct &&
            sliderProduct.map((value, index) => {
                return (
                    <Product
                        key={index}
                        defaultClasses={defaultClasses}
                        value={value}
                        config={config}
                        classes={classes}
                    />
                );
            }),
        [config, classes, sliderProduct]
    );

    return (
        <>
            {showLinkedProduct != 0 && sliderProduct && (
                <section
                    className={
                        defaultClasses.h_products +
                        ' ' +
                        defaultClasses.homepage_sections
                    }
                >
                    <div className="container">
                        <div className="row">
                            <div
                                className={
                                    defaultClasses.h_products_column +
                                    ' ' +
                                    'col-xs-12 col-lg-12 col-sm-12 col-md-12'
                                }
                            >
                                <div className={defaultClasses.section_heading}>
                                    <h3
                                        className={
                                            defaultClasses.homepage_section_heading
                                        }
                                    >
                                        {name}
                                    </h3>
                                </div>
                                <React.Fragment>
                                    {sliderProduct &&
                                        typeof sliderProduct != 'undefined' && (
                                            <OwlCarousel
                                                className={
                                                    'owl-theme' +
                                                    ' ' +
                                                    defaultClasses.owl_thme_design
                                                }
                                                loop={false}
                                                rewind={true}
                                                margin={10}
                                                nav={true}
                                                dots={true}
                                                autoplay={true}
                                                autoplayTimeout={4000}
                                                items={5}
                                                responsive={responsive1}
                                            >
                                                {sliderProduct
                                                    ? productComponents
                                                    : ''}
                                            </OwlCarousel>
                                        )}
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
