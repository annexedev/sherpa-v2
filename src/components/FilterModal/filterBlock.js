import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { Form } from 'informed';
import { useFilterBlock } from 'src/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import FilterList from './FilterList';
import defaultClasses from './filterBlock.css';
import FilterPrice from './FilterList/FilterPrice';

const FilterBlock = props => {
    const {
        filterApi,
        filterState,
        group,
        items,
        name,
        onApply,
        enablePriceSlider
    } = props;
    let iconShow = true;
    const talonProps = useFilterBlock();
    const { handleClick, isExpanded } = talonProps;
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    const classes = mergeClasses(defaultClasses, props.classes);
    const listClass = isExpanded
        ? classes.list_expanded
        : classes.list_collapsed;
    if (group == 'price' && !isExpanded && enablePriceSlider == 1) {
        handleClick();
    }
    if (group == 'price' && enablePriceSlider == 1) {
        iconShow = false;
    }
    return (
        <li className={classes.root}>
            <button
                className={classes.trigger}
                onClick={handleClick}
                type="button"
            >
                <span className={classes.header}>
                    <span className={classes.name}>{name}</span>
                    {iconShow && <Icon src={iconSrc} />}
                </span>
            </button>
            <Form className={listClass}>
                {group == 'price' && enablePriceSlider == 1 ? (
                    <FilterPrice
                        onApply={onApply}
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        items={items}
                        name={name}
                    />
                ) : (
                    <FilterList
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        items={items}
                        onApply={onApply}
                    />
                )}
            </Form>
        </li>
    );
};

export default FilterBlock;

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list_collapsed: string,
        list_expanded: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired
};
