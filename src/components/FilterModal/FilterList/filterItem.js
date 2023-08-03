import React, { useCallback, useMemo } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';

import FilterDefault from './filterDefault';

const FilterItem = props => {
    const { filterApi, filterState, group, item, onApply } = props;
    const { toggleItem } = filterApi;
    const { title, value, count } = item;
    const isSelected = filterState && filterState.has(item);

    // create and memoize an item that matches the tile interface
    const tileItem = useMemo(
        () => ({
            count: count,
            label: title,
            value_index: value
        }),
        [title, value, count]
    );

    const handleClick = useCallback(() => {
        toggleItem({ group, item });
        if (typeof onApply != 'undefined') {
            onApply();
        }
    }, [group, item, toggleItem, onApply]);

    return (
        <FilterDefault
            isSelected={isSelected}
            item={tileItem}
            onClick={handleClick}
            title={title}
            value={value}
        />
    );
};

export default FilterItem;

FilterItem.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    item: shape({
        title: string.isRequired,
        value: oneOfType([number, string]).isRequired
    }).isRequired
};
