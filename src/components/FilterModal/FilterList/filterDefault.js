import React from 'react';
import { bool, shape, string } from 'prop-types';

import Checkbox from '../../Checkbox';
import { mergeClasses } from '../../../classify';
import defaultClasses from './filterDefault.css';

function isNumeric(str) {
    if (typeof str != "string") return false  
    return !isNaN(str) &&
           !isNaN(parseFloat(str)) 
  }

const FilterDefault = props => {
    const { classes: propsClasses, isSelected, item, ...restProps } = props;
    const { label, value_index, count } = item || {};
    const classes = mergeClasses(defaultClasses, propsClasses);

    var newStr = label.replace(/-/g, "");
    let newlabel;

    if(isNumeric(newStr)) {
        newlabel = '$'+label.replace(/-/g, " - $");
    } else {
        newlabel = label;
    }

    return (
        <Checkbox
            classes={classes.root}
            field={`${newlabel}-${value_index}`}
            fieldState={{
                value: isSelected
            }}
            label={`${newlabel} (${count})`}
            {...restProps}
        />
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        label: string,
        checked: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: string.isRequired
    }).isRequired,
    label: string
};
