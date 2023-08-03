import React, { useEffect, useState, useCallback } from 'react';
import { Form } from 'informed';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from '../Icon';
import { ChevronDown as ChevronDownIcon, X as ClearIcon } from 'react-feather';

const clearIcon = <Icon src={ClearIcon} size={30} />;
const chevrondownIcon = <Icon src={ChevronDownIcon} size={18} />;
import {
    useProductReviews,
    useProductRatings,
    useSubmitProductReview
} from '../../peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import getAllProductReviews from '../../queries/getProductReviews.graphql';
import getProductRatings from '../../queries/getProductRatings.graphql';
import submitProductReview from '../../queries/submitProductReview.graphql';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import cedClasses from './productFullDetail.css';

import { Modal } from '../Modal';
import { useToasts } from '@magento/peregrine';
import { useCedContext } from 'src/peregrine/lib/context/ced';

const ProductReviews = props => {
    // const [render, setRender] = useState(false);
    const { formatMessage } = useIntl();

    const { product } = props;
    const [addedReviewMsg, setAddedReviewMsg] = useState(false);
    const [, { addToast }] = useToasts();
    const [{ currentUser, isSignedIn }] = useUserContext();
    const [, { setOverlay }] = useCedContext();

    const submitProductReviewTalonProps = useSubmitProductReview({
        query: submitProductReview
    });

    const closePopup = useCallback(() => {
        setOverlay(false);
        $('#revire_form_popup').removeClass(defaultClasses.active);
        document
            .getElementsByTagName('html')[0]
            .setAttribute('data-scroll-lock', 'false');
    }, [setOverlay]);

    const { submitReview, reviewResponseData } = submitProductReviewTalonProps;
    useEffect(() => {
        if (reviewResponseData.success === true && addedReviewMsg) {
            document.getElementsByName('nickname').value =
                currentUser.firstname;
            addToast({
                type: 'info',
                message: reviewResponseData.message,
                dismissable: true,
                timeout: 2000
            });
            setAddedReviewMsg(false);
            closePopup();
        }
    }, [
        reviewResponseData.success,
        reviewResponseData.message,
        addedReviewMsg,
        currentUser.firstname,
        addToast,
        closePopup
    ]);

    const reviewsProps = useProductReviews({
        query: getAllProductReviews,
        product_id: product.id,
        current_page: 1,
        limit: 5
    });

    const ratingsProps = useProductRatings({
        query: getProductRatings
    });

    const { productRatings } = ratingsProps;
    const [ratings, setRatings] = useState([]);
    const [ratingError, setRatingError] = useState(false);
    const [activeSelect, setActiveSelect] = useState();
    const [ratingSelect, setRatingSelect] = useState([]);

    const { productReviews } = reviewsProps;
    let avgrating = '';
    let totalRating = 0;
    let totalStarts = '';
    if (typeof productReviews != 'undefined') {
        avgrating =
            productReviews.avgRating == null ? 0 : productReviews.avgRating;
        totalRating = productReviews.totalRating;
        totalStarts = productReviews.totalStarts;
    }

    const classes = mergeClasses(cedClasses, props.classes);

    const ratingSelection = (rating_code, option_value) => {
        var obj = {};
        obj = ratingSelect;
        obj[rating_code] = option_value;
        setRatingSelect(obj);
        if (!activeSelect) {
            setActiveSelect(true);
        }
    };
    const handleSubmit = event => {
        if (ratings.length === productRatings.data.length) {
            setRatingError(false);
            submitReview({
                ratings: JSON.stringify(ratings),
                nickname: event.nickname,
                title: event.title,
                detail: event.detail,
                product_id: parseInt(product.id)
            });
            setAddedReviewMsg(true);
        } else {
            setRatingError(true);
        }
    };

    const ShowPop = () => {
        setOverlay(true);
        $('#revire_form_popup').addClass(defaultClasses.active);
        document
            .getElementsByTagName('html')[0]
            .setAttribute('data-scroll-lock', 'true');
    };

    const handleRatingChange = (ratingId, event) => {
        ratings.map((value, index) => {
            if (value.indexOf(ratingId + ':') > -1) {
                ratings.splice(index, 1);
            }
        });
        ratings.push(ratingId + ':' + event.target.value);
        setRatings(ratings);
    };

    let starRating = {};
    if (productReviews != '' && typeof productReviews != 'undefined') {
        starRating = JSON.parse(productReviews.ratingStarCount);
    }

    return (
        <div
            className={
                classes.rviews_tab + ' ' + classes.tab_list + ' ' + 'card'
            }
        >
            <div
                className={'card-header' + ' ' + classes.card_header}
                id="headingThree"
            >
                <div
                    className={
                        'btn btn-link collapsed' +
                        ' ' +
                        classes.product_tabs_list
                    }
                    type="button"
                    data-toggle="collapse"
                    data-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                >
                    <span>
                        <FormattedMessage
                            id="productReview.CustomerReviews"
                            defaultMessage="Customer Reviews"
                        />
                        ({totalRating})
                    </span>
                    <span className={classes.tabs_arrow}>
                        {chevrondownIcon}
                    </span>
                </div>
            </div>
            <div
                id="collapseThree"
                className="collapse"
                aria-labelledby="headingThree"
                data-parent="#accordionExample"
            >
                <div
                    className={
                        defaultClasses.tabs_content_custom + ' ' + 'card-body'
                    }
                >
                    {reviewResponseData && reviewResponseData.success === true && (
                        <div className={defaultClasses.success_message_wrapper}>
                            <p
                                className={
                                    defaultClasses.success_message +
                                    ' ' +
                                    'd-flex align-center'
                                }
                            >
                                <span className={'mr-2'}>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </span>
                                {reviewResponseData.message}
                            </p>
                        </div>
                    )}
                    {reviewResponseData &&
                        reviewResponseData.success === false && (
                            <div
                                className={defaultClasses.error_message_wrapper}
                            >
                                <p className={defaultClasses.error_message}>
                                    {reviewResponseData.message}
                                </p>
                            </div>
                        )}
                    <Modal>
                        <div
                            id="revire_form_popup"
                            className={defaultClasses.revire_form_popup}
                        >
                            <div className={defaultClasses.overlay} />
                            <div className={defaultClasses.review_form_inner}>
                                <div
                                    className={
                                        defaultClasses.review_form_wrapper
                                    }
                                >
                                    {!(
                                        productRatings.allow_guest_customer_to_write_review ===
                                            false && isSignedIn === false
                                    ) && (
                                        <Form
                                            className={
                                                defaultClasses.review_form_wrap
                                            }
                                            id="product-review-submit"
                                            initialValues={{
                                                nickname: currentUser.firstname
                                            }}
                                            onSubmit={handleSubmit}
                                        >
                                            <div
                                                className={
                                                    defaultClasses.add_review_wrapper
                                                }
                                            >
                                                <div
                                                    className={
                                                        defaultClasses.custom_review_stars
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            defaultClasses.close_popup
                                                        }
                                                    >
                                                        <button
                                                            onClick={closePopup}
                                                        >
                                                            {clearIcon}
                                                        </button>
                                                    </div>
                                                    <p
                                                        className={
                                                            defaultClasses.rate_text +
                                                            ' ' +
                                                            'mb-0'
                                                        }
                                                    >
                                                        <FormattedMessage
                                                            id={
                                                                'ProductReview.ratingQuestion'
                                                            }
                                                            defaultMessage={
                                                                'How would you rate this product?'
                                                            }
                                                        />
                                                    </p>
                                                    {typeof productRatings.data !=
                                                        'undefined' &&
                                                        productRatings.data.map(
                                                            (v, i) => {
                                                                var options = JSON.parse(
                                                                    v.options
                                                                );
                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        className={
                                                                            defaultClasses.user_ratings_wrapper
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                defaultClasses.rating_title
                                                                            }
                                                                        >
                                                                            {
                                                                                v.rating_code
                                                                            }
                                                                        </span>
                                                                        <div
                                                                            className={
                                                                                defaultClasses.rating_outer
                                                                            }
                                                                        >
                                                                            {typeof options !=
                                                                                'undefined' &&
                                                                                options.map(
                                                                                    (
                                                                                        optionArr,
                                                                                        i
                                                                                    ) => {
                                                                                        var ratingSelectedValue =
                                                                                            ratingSelect[
                                                                                                v
                                                                                                    .rating_code
                                                                                            ];
                                                                                        var ratingOptionValue =
                                                                                            optionArr.option_value;
                                                                                        var ratingClass =
                                                                                            defaultClasses.rating_str;

                                                                                        if (
                                                                                            parseInt(
                                                                                                ratingOptionValue
                                                                                            ) <=
                                                                                            parseInt(
                                                                                                ratingSelectedValue
                                                                                            )
                                                                                        ) {
                                                                                            ratingClass =
                                                                                                defaultClasses.activeSelect +
                                                                                                ' ' +
                                                                                                defaultClasses.rating_str;
                                                                                        }
                                                                                        return (
                                                                                            <div
                                                                                                key={
                                                                                                    i
                                                                                                }
                                                                                                className={
                                                                                                    defaultClasses.star_wrapper
                                                                                                }
                                                                                            >
                                                                                                <input
                                                                                                    className={
                                                                                                        ratingClass
                                                                                                    }
                                                                                                    onClick={e => {
                                                                                                        ratingSelection(
                                                                                                            v.rating_code,
                                                                                                            optionArr.option_value
                                                                                                        );
                                                                                                        handleRatingChange(
                                                                                                            v.rating_id,
                                                                                                            e
                                                                                                        );
                                                                                                    }}
                                                                                                    type="radio"
                                                                                                    id={
                                                                                                        v.rating_code +
                                                                                                        '_' +
                                                                                                        optionArr.option_value
                                                                                                    }
                                                                                                    name={
                                                                                                        'rating[' +
                                                                                                        v.rating_id +
                                                                                                        ']'
                                                                                                    }
                                                                                                    value={
                                                                                                        optionArr.option_id
                                                                                                    }
                                                                                                />
                                                                                                <label
                                                                                                    className={
                                                                                                        defaultClasses.star
                                                                                                    }
                                                                                                    htmlFor={
                                                                                                        v.rating_code +
                                                                                                        '_' +
                                                                                                        optionArr.option_value
                                                                                                    }
                                                                                                >
                                                                                                    <FontAwesomeIcon
                                                                                                        icon={
                                                                                                            faStar
                                                                                                        }
                                                                                                    />
                                                                                                </label>
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    {ratingError && (
                                                        <p
                                                            className={
                                                                defaultClasses.root_error
                                                            }
                                                        >
                                                            {
                                                                'Please select one of each of the ratings above.'
                                                            }
                                                        </p>
                                                    )}
                                                    <div
                                                        className={
                                                            defaultClasses.product_ratingform_wrapper +
                                                            ' ' +
                                                            'pt-3'
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                defaultClasses.form_field
                                                            }
                                                        >
                                                            <Field
                                                                label={formatMessage(
                                                                    {
                                                                        id:
                                                                            'productReview.nickname',
                                                                        defaultMessage:
                                                                            'Nickname'
                                                                    }
                                                                )}
                                                            >
                                                                <TextInput
                                                                    field="nickname"
                                                                    validate={
                                                                        isRequired
                                                                    }
                                                                />
                                                            </Field>
                                                        </div>
                                                        <div
                                                            className={
                                                                defaultClasses.form_field
                                                            }
                                                        >
                                                            <Field
                                                                label={formatMessage(
                                                                    {
                                                                        id:
                                                                            'productReview.Summary',
                                                                        defaultMessage:
                                                                            'Summary'
                                                                    }
                                                                )}
                                                            >
                                                                <TextInput
                                                                    field="title"
                                                                    validate={
                                                                        isRequired
                                                                    }
                                                                />
                                                            </Field>
                                                        </div>
                                                        <div
                                                            className={
                                                                defaultClasses.form_field
                                                            }
                                                        >
                                                            <Field
                                                                label={formatMessage(
                                                                    {
                                                                        id:
                                                                            'productReview.Review',
                                                                        defaultMessage:
                                                                            'Review'
                                                                    }
                                                                )}
                                                            >
                                                                <TextArea
                                                                    field="detail"
                                                                    validate={
                                                                        isRequired
                                                                    }
                                                                />
                                                            </Field>
                                                        </div>
                                                        <div
                                                            className={
                                                                defaultClasses.product_ratingform_submit +
                                                                ' ' +
                                                                'my-4'
                                                            }
                                                        >
                                                            <Button
                                                                priority="high"
                                                                type="submit"
                                                            >
                                                                <FormattedMessage
                                                                    id={
                                                                        'ProductReview.product_ratingform_submit'
                                                                    }
                                                                    defaultMessage={
                                                                        'Submit Review'
                                                                    }
                                                                />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>

                    {typeof productReviews.data != 'undefined' &&
                        productReviews.data.length != 0 && (
                            <div
                                className={
                                    defaultClasses.overall_product_review_wrap
                                }
                            >
                                <div
                                    className={defaultClasses.rating_histogram}
                                >
                                    {Object.keys(starRating).length > 0 &&
                                        Object.keys(starRating).map(function(
                                            name,
                                            index
                                        ) {
                                            return (
                                                <div
                                                    key={index + 'rating_div'}
                                                    className={
                                                        defaultClasses.histogram_row
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            defaultClasses.histogram_star_number
                                                        }
                                                    >
                                                        {name}
                                                        <span
                                                            className={
                                                                defaultClasses.histogram_star_icon
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faStar}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={
                                                            defaultClasses.histgram_rating_progress
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                defaultClasses.histgram_rating_outer
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    defaultClasses.histgram_rating_inner
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={
                                                            defaultClasses.histogram_rating_percentage
                                                        }
                                                    >
                                                        <span>
                                                            {' '}
                                                            {`${
                                                                starRating[name]
                                                            }%`}{' '}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div
                                    className={
                                        defaultClasses.overall_product_rate
                                    }
                                >
                                    <div
                                        className={defaultClasses.rating_result}
                                    >
                                        <span
                                            className={classes.not_reviewed}
                                            style={{ width: avgrating + '%' }}
                                        >
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                        <span className={classes.reviewed}>
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                        </span>
                                    </div>
                                    <p className={defaultClasses.overall_text}>
                                        <span className={'mr-2'}>
                                            {totalStarts}
                                        </span>
                                        <FormattedMessage
                                            id="ProductReview.outOfTotalStars"
                                            defaultMessage="out of 5 stars"
                                        />
                                    </p>
                                </div>
                            </div>
                        )}
                    {productRatings.allow_guest_customer_to_write_review ===
                        false &&
                        isSignedIn === false && (
                            <>
                                <p className={defaultClasses.review_message}>
                                    Only registered users can write a review.
                                </p>
                                <p
                                    className={
                                        defaultClasses.user_account_links
                                    }
                                >
                                    Please{' '}
                                    <button
                                        onClick={() => {
                                            document
                                                .getElementById('user_account')
                                                .click();
                                        }}
                                    >
                                        sign-in
                                    </button>{' '}
                                    or{' '}
                                    <a href="create-account">create-account</a>
                                </p>
                            </>
                        )}
                    {!(
                        productRatings.allow_guest_customer_to_write_review ===
                            false && isSignedIn === false
                    ) && (
                        <div className={defaultClasses.give_review_wrap}>
                            <h2 className={defaultClasses.give_review_head}>
                                <FormattedMessage
                                    id="ProductReview.give_review_head"
                                    defaultMessage="Review this product"
                                />
                            </h2>
                            <button
                                className={defaultClasses.give_review_butotn}
                                onClick={ShowPop}
                            >
                                <FormattedMessage
                                    id={'ProductReview.give_review_butotn'}
                                    defaultMessage={'Write product review'}
                                />{' '}
                            </button>
                        </div>
                    )}
                    <div
                        id="customer-reviews"
                        className={defaultClasses.customer_review}
                    >
                        <div className={defaultClasses.block_title}>
                            <strong
                                className={
                                    defaultClasses.review_heading + ' ' + 'mb-3'
                                }
                            >
                                <FormattedMessage
                                    id={'ProductReview.review_heading'}
                                    defaultMessage={'Customer Reviews'}
                                />
                            </strong>
                        </div>
                        {typeof productReviews.data != 'undefined' &&
                            productReviews.data.length == 0 && (
                                <div
                                    className={defaultClasses.give_review_wrap}
                                >
                                    <p
                                        className={
                                            defaultClasses.no_review_message
                                        }
                                    >
                                        <FormattedMessage
                                            id={'ProductReview.noReviewMessage'}
                                            defaultMessage="No Reviews Available. Be the first one To Review This
                    Product."
                                        />
                                    </p>
                                </div>
                            )}

                        <div
                            className={
                                defaultClasses.blockcontent +
                                ' ' +
                                defaultClasses.customer_reviews_list
                            }
                        >
                            <ul className={defaultClasses.review_items}>
                                {typeof productReviews.data != 'undefined' &&
                                    productReviews.data.map((v, i) => {
                                        var ratingData = JSON.parse(v.rating);
                                        return (
                                            <li
                                                key={i + 'ratings'}
                                                className={
                                                    defaultClasses.item +
                                                    ' ' +
                                                    defaultClasses.review_item
                                                }
                                            >
                                                <div
                                                    className={
                                                        defaultClasses.cust_review_head
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            defaultClasses.customer_first_let
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                defaultClasses.cust_name_firstlet
                                                            }
                                                        >
                                                            <FormattedMessage
                                                                id={
                                                                    'ProductReview.cust_name_firstlet'
                                                                }
                                                                defaultMessage={
                                                                    's'
                                                                }
                                                            />
                                                        </span>
                                                    </div>
                                                    <div
                                                        className={
                                                            defaultClasses.custom_details_review
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                defaultClasses.review_details +
                                                                ' ' +
                                                                'd-flex'
                                                            }
                                                        >
                                                            <p
                                                                className={
                                                                    defaultClasses.review_author +
                                                                    ' ' +
                                                                    'mb-0' +
                                                                    ' ' +
                                                                    'pr-2'
                                                                }
                                                            >
                                                                <strong
                                                                    className={
                                                                        defaultClasses.user_name
                                                                    }
                                                                >
                                                                    {v.nickname}{' '}
                                                                </strong>
                                                            </p>
                                                            {ratingData &&
                                                                ratingData.map(
                                                                    value => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    i +
                                                                                    'rating_form'
                                                                                }
                                                                                className={
                                                                                    defaultClasses.rating_summary +
                                                                                    ' ' +
                                                                                    'd-flex'
                                                                                }
                                                                            >
                                                                                <div
                                                                                    className={
                                                                                        defaultClasses.rating_result
                                                                                    }
                                                                                >
                                                                                    <span
                                                                                        className={
                                                                                            classes.not_reviewed
                                                                                        }
                                                                                        style={{
                                                                                            width:
                                                                                                value.rating_percent +
                                                                                                '%'
                                                                                        }}
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                    <span
                                                                                        className={
                                                                                            classes.reviewed
                                                                                        }
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                        <FontAwesomeIcon
                                                                                            icon={
                                                                                                faStar
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                        </div>
                                                        <div
                                                            className={
                                                                defaultClasses.review_title
                                                            }
                                                        >
                                                            {v.review}
                                                        </div>
                                                        <p
                                                            className={
                                                                defaultClasses.review_date +
                                                                ' ' +
                                                                'mb-0'
                                                            }
                                                        >
                                                            <time
                                                                className={
                                                                    defaultClasses.review_details_value
                                                                }
                                                            >
                                                                {v.created_at}
                                                            </time>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className={
                                                        defaultClasses.review_content
                                                    }
                                                >
                                                    <p className={'mb-0'}>
                                                        {v.detail}
                                                    </p>
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                            {typeof productReviews.data != 'undefined' &&
                                productReviews.data.length <
                                    productReviews.totalRating && (
                                    <button onClick={loadMore}>
                                        <FormattedMessage
                                            id={'ProductReview.loadMore'}
                                            defaultMessage={'Load More'}
                                        />
                                    </button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
