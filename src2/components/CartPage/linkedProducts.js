import React, { useState, useMemo } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import homeClasses from '../CedHome/home.css';
import Product from './product';
import cartClasses from './cartPage.css';
// import cart from "@magento/peregrine/lib/context/cart";

const LinkedProducts = props => {
    const { linkedProducts } = props;
    const [products, setProducts] = useState([]);
    //const { config } = useGetScopeCache();
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
            items: 5
        }
    };
    var productArray = [];
    if (products.length == 0) {
        linkedProducts.forEach(element => {
            var elementData = element.crosssell_products;
            elementData.forEach(elem => {
                productArray.push(elem);
            });
        });
        if (productArray.length) setProducts(productArray);
    }
    const defaultClasses = mergeClasses(homeClasses, props.classes);

    const productComponents = useMemo(
        () =>
            products &&
            products.map((value, index) => {
                return (
                    <Product
                        key={index}
                        defaultClasses={defaultClasses}
                        value={value}
                    />
                );
            }),
        [defaultClasses, products]
    );

    if (typeof products != 'undefined' && products.length > 0) {
        return (
            <section
                className={
                    'py-3' +
                    ' ' +
                    homeClasses.h_products +
                    ' ' +
                    cartClasses.h_products
                }
            >
                <div className="container-fluid p-0">
                    <div className="row">
                        <div
                            className={
                                homeClasses.h_products_column +
                                ' ' +
                                'col-xs-12 col-lg-12 col-sm-12 col-md-12'
                            }
                        >
                            <div className={homeClasses.section_heading}>
                                <h3
                                    className={
                                        homeClasses.homepage_section_heading
                                    }
                                >
                                    You can also like these products
                                </h3>
                            </div>
                            <React.Fragment>
                                <OwlCarousel
                                    className={
                                        'owl-theme' +
                                        ' ' +
                                        homeClasses.owl_thme_design +
                                        ' ' +
                                        cartClasses.owl_thme_design
                                    }
                                    loop={true}
                                    rewind={true}
                                    margin={10}
                                    nav={true}
                                    dots={false}
                                    autoplay={false}
                                    autoplayTimeout={2000}
                                    items={5}
                                    responsive={responsive1}
                                >
                                    {productComponents}
                                </OwlCarousel>
                            </React.Fragment>
                            {/* end
                             */}
                        </div>
                    </div>
                </div>
            </section>
        );
    } else {
        return <div />;
    }
};

LinkedProducts.propTypes = {};

export default LinkedProducts;
