import React, { useState } from 'react';
import { bool, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSearchBar } from 'src/peregrine/lib/talons/SearchBar';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Autocomplete from './autocomplete';
import SearchField from './searchField';
import defaultClasses from './searchBar.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { X as ClearIcon } from 'react-feather';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch('EQYYQ1VIVL', 'f5171cf0ca4526d103a14ad056e5cef1');

function Hit({ hit }) {
  return (
    <article>
      <img src={hit.image_url} alt={hit.name} />
      <p>{hit.categories[0]}</p>
      <h1>{hit.name}</h1>
    </article>
  );
}



const clearIcon = <Icon src={ClearIcon} size={24} />;
const SearchBar = props => {
    const { isOpen, handleSearchTriggerClick } = props;
    const [triggerSearch, setTriggerSearch] = useState(false);
    const talonProps = useSearchBar();
    const {
        containerRef,
        expanded,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        setExpanded,
        valid
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;

    return (
        <div className={rootClassName}>
            <div
                ref={containerRef}
                className={classes.container + ' ' + 'container'}
            >
                <div className={classes.search_header}>
                    <h3 className={classes.heading}>
                        <FormattedMessage
                            id="SearchBar.heading"
                            defaultMessage="What are you looking for ?"
                        />
                    </h3>
                    <button
                        id="close-button"
                        className={classes.close}
                        onClick={handleSearchTriggerClick}
                    >
                        {clearIcon}
                    </button>
                </div>
                <InstantSearch indexName="magento2_prod_default_products" searchClient={searchClient}>
                  
                  <SearchBox />
                  <Hits hitComponent={Hit} />
                 
                </InstantSearch>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.autocomplete}>
                        <Autocomplete
                            setTriggerSearch={setTriggerSearch}
                            handleSearchTriggerClick={handleSearchTriggerClick}
                            setVisible={setExpanded}
                            valid={valid}
                            visible={expanded}
                        />
                    </div>
                    <div className={classes.search}>
                        <SearchField
                            closeSearch={e =>
                                handleSubmit({ search_query: e.target.value })
                            }
                            triggerSearch={triggerSearch}
                            handleSearchTriggerClick={handleSearchTriggerClick}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            setTriggerSearch={setTriggerSearch}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SearchBar;

SearchBar.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    isOpen: bool
};
