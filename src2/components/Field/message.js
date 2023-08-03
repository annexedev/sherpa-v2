import React from 'react';
import { node, shape, string } from 'prop-types';

import defaultClasses from './message.css';
import { mergeClasses } from '../../classify';
import { useIntl } from 'react-intl';

const Message = props => {
    const { children, classes: propClasses, fieldState } = props;
    const { formatMessage } = useIntl();
    const { error } = fieldState;
    //  const errorMessage = error || asyncError;

    const classes = mergeClasses(defaultClasses, propClasses);
    const className = error ? classes.root_error : classes.root;
    let translatedErrorMessage;

    if (error) {
        translatedErrorMessage = formatMessage(
            {
                id: error.id,
                defaultMessage: error.defaultMessage
            },
            { value: error.value }
        );
    }

    return <p className={className}>{translatedErrorMessage || children}</p>;
};

export default Message;

Message.defaultProps = {
    fieldState: {}
};

Message.propTypes = {
    children: node,
    classes: shape({
        root: string,
        root_error: string
    }),
    fieldState: shape({
        asyncError: string,
        error: string
    })
};
