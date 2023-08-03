import React from 'react';
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    PinterestShareButton,
    PinterestIcon,
    WhatsappShareButton,
    WhatsappIcon
} from 'react-share';
import { resourceUrl } from 'src/drivers';
import defaultClasses from './productFullDetail.css';

function ProductSharingIcons(props) {
    const { classes, productDetails, image } = props;

    return (
        <div className={classes.social_share_wrap}>
            <TwitterShareButton
                title={'Get this best offer on item : ' + productDetails.name}
                separator={' :: '}
                openShareDialogOnClick="true"
                url={window.location.href}
                style={{
                    backgroundColor: '#00aced',
                    padding: '5px',
                    marginRight: '10px',
                    color: '#ffffff',
                    borderRadius: '3px'
                }}
            >
                <TwitterIcon round={true} size={25} />
                <span className={defaultClasses.social_text}>
                    {' Twitter '}
                </span>
            </TwitterShareButton>
            <FacebookShareButton
                url={window.location.href}
                quote={productDetails.name}
                hashtag={productDetails.name}
                style={{
                    backgroundColor: '#3b5998',
                    padding: '5px',
                    marginRight: '10px',
                    color: '#ffffff',
                    borderRadius: '3px'
                }}
            >
                <FacebookIcon round={true} size={25} />
                <span className={defaultClasses.social_text}>
                    {' Facebook '}
                </span>
            </FacebookShareButton>
            <LinkedinShareButton
                url={window.location.href}
                title={'Get this best offer on item : ' + productDetails.name}
                style={{
                    backgroundColor: '#007fb1',
                    padding: '5px',
                    marginRight: '10px',
                    color: '#ffffff',
                    borderRadius: '3px'
                }}
            >
                <LinkedinIcon round={true} size={25} />
                <span className={defaultClasses.social_text}>
                    {' Linkedin '}
                </span>
            </LinkedinShareButton>
            <PinterestShareButton
                media={resourceUrl(image, {
                    type: 'image-product',
                    width: 500
                })}
                url={window.location.href}
                description={productDetails.name}
                style={{
                    backgroundColor: '#cb2128',
                    padding: '5px',
                    marginRight: '10px',
                    color: '#ffffff',
                    borderRadius: '3px'
                }}
            >
                <PinterestIcon round={true} size={25} />
                <span className={defaultClasses.social_text}>
                    {' Pinterest '}
                </span>
            </PinterestShareButton>
            <WhatsappShareButton
                title={'Get this best offer on item : ' + productDetails.name}
                separator={' :: '}
                openShareDialogOnClick="true"
                url={window.location.href}
                style={{
                    backgroundColor: 'rgb(37, 211, 102)',
                    color: 'white',
                    marginRight: '5px',
                    padding: '5px',
                    transition: 'all .2s ease-in-out'
                }}
            >
                <WhatsappIcon round={false} size={25} />
                <span className={defaultClasses.social_text}>
                    {' WhatsApp '}
                </span>
            </WhatsappShareButton>
        </div>
    );
}

export default ProductSharingIcons;
