import React from 'react';
import classNames from 'classnames';
import { Search as SearchIcon } from 'react-feather';

export function SearchInput({ navbar, className, onChange, value }) {
  return (
    <form className={classNames('d-none d-sm-inline-block search', className)}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search…"
          aria-label="Search"
          defaultValue={value}
          onChange={({ target }) => onChange(target.value)}
        />
        <SearchIcon className="align-middle" />
      </div>
    </form>
  );
}

export default SearchInput;
