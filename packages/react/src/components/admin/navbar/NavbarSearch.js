import React from 'react';
import { Search as SearchIcon } from 'react-feather';

export function NavbarSearch({ value, onChange }) {
  return (
    <form className="d-none d-sm-inline-block">
      <div className="input-group input-group-navbar">
        <input
          type="text"
          className="form-control"
          placeholder="Search…"
          aria-label="Search"
          value={value}
          onChange={({ target }) => onChange(target.value)}
        />
        <button className="btn" type="button">
          <SearchIcon className="align-middle" />
        </button>
      </div>
    </form>
  );
}

NavbarSearch.defaultProps = {
  value: ''
};

export default NavbarSearch;
