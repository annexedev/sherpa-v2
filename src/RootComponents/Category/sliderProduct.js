import React, { useMemo } from 'react';
import { mergeClasses } from '../../classify';
import { useGetScopeCache } from '../../peregrine/lib/talons/Home/useHome';
import defaultClasses from '../../components/CedHome/home.css';
import Product from '../../components/CedHome/product';
import OwlCarousel from 'react-owl-carousel';

export default function FeaturedProduct(props) {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { featuredData } = props;
    const responsive1 = {
        0: {
            items: 2
        },
        450: {
            items: 2
        },
        600: {
            items: 3
        },
        1000: {
            items: 4
        }
    };

    const { config } = useGetScopeCache();
    const productComponents = useMemo(
        () =>
            featuredData &&
            featuredData.map((value, index) => {
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
        [config, classes, featuredData]
    );

    return (
        <>
            {featuredData && (
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
                                <React.Fragment>
                                    {featuredData &&
                                        typeof featuredData != 'undefined' && (
                                            <OwlCarousel
                                                className={
                                                    'owl-theme' +
                                                    ' ' +
                                                    defaultClasses.owl_thme_design
                                                }
                                                loop={false}
                                                rewind={true}
                                                margin={5}
                                                nav={true}
                                                dots={true}
                                                autoplay={true}
                                                autoplayTimeout={2000}
                                                items={5}
                                                responsive={responsive1}
                                            >
                                                {featuredData
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
