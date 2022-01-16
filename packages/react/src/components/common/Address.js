import React from 'react';

export function Address({ street, city, state, postalCode, country, name }) {
  const linkParts = [street, city, state, postalCode].filter((part) => part);

  let googleMapsLink = `https://www.google.com/maps/search/${linkParts.join(
    '+'
  )}`;

  const Wrapper = linkParts.length
    ? ({ children }) => (
        <a target="_blank" rel="noreferrer" href={googleMapsLink}>
          {children}
        </a>
      )
    : 'span';

  return (
    <Wrapper>
      {name && (
        <div>
          <strong>{name}</strong>
        </div>
      )}
      {street && <div>{street}</div>}
      {(city || state) && (
        <div>
          {city}
          {state && ', '}
          {state}
        </div>
      )}
      {postalCode && <div>{postalCode}</div>}
      {country && <div>{country}</div>}
    </Wrapper>
  );
}

export default Address;
