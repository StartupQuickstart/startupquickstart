import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { Search as SearchIcon } from 'react-feather';
import _ from 'lodash';

export function SearchInput({
  navbar,
  className,
  onChange,
  defaultValue = ''
}) {
  const [value, setValue] = useState(defaultValue);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pushChange = useCallback(
    _.debounce((search) => {
      onChange && onChange(search);
    }, 250),
    [onChange]
  );

  useEffect(() => {
    pushChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushChange, value]);

  return (
    <form className={classNames('d-none d-sm-inline-block search', className)}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search…"
          aria-label="Search"
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
        <SearchIcon className="align-middle" />
      </div>
    </form>
  );
}

export default SearchInput;
