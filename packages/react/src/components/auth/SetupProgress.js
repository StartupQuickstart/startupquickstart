import React from 'react';
import { Check } from 'react-feather';
import { useSetup } from 'context/providers';

export default function SetupProgress({ active, completed }) {
  const { setupItems } = useSetup();

  const className = (item) => (active === item ? 'active' : '');

  return (
    <ul className="setup-progress">
      {setupItems.map((item, index) => {
        return (
          <li className={className(item.name)} key={index}>
            {!completed?.includes(item.name) && (
              <span className="progress-bullet"></span>
            )}
            {completed?.includes(item.name) && (
              <span className="progress-completed">
                <Check size="10" />
              </span>
            )}
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
