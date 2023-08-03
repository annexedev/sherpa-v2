import React from 'react';
import { shape, string, array } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../Button';
import { useStyle } from '../../classify';
import defaultClasses from './filterModalOpenButton.css';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal';
import { useMobile } from '../../peregrine/lib/talons/Mobile/useMobile';
const FilterModalOpenButton = props => {
    const { mobileView } = useMobile();
    const { filters, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const { handleOpen } = useFilterModal({ filters });

    return (
        <Button
            priority={'low'}
            classes={{
                root_lowPriority: classes.filterButton
            }}
            onClick={handleOpen}
            type="button"
            aria-live="polite"
            aria-busy="false"
        >
            {mobileView && (
                <span className={'mr-2' + ' ' + defaultClasses.filter_img}>
                    <img
                        src="/cenia-static/images/filter.png"
                        width="15"
                        height="15"
                        alt="filter"
                    />
                </span>
            )}
            <FormattedMessage
                id={'productList.filter'}
                defaultMessage={'Filter'}
            />
        </Button>
    );
};

export default FilterModalOpenButton;

FilterModalOpenButton.propTypes = {
    classes: shape({
        filterButton: string
    }),
    filters: array
};
