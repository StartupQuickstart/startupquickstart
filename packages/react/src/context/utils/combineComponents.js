import React from 'react';

export const combineComponents = (...components) => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children, ...props }) => {
        return (
          <AccumulatedComponents {...props}>
            <CurrentComponent {...props}>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};
