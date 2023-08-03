import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import defaultClasses from './myAccount.css';
import Sidebar from './sidebar.js';

const MyDownloadable = props => {
    return (
        <div className={defaultClasses.columns}>
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
                            <FormattedMessage
                                id={'MyDownloadableProduct.Downloadable'}
                                defaultMessage={'My Downloadable'}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDownloadable;

MyDownloadable.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    })
};
