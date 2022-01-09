import React, { createContext, useReducer } from 'react';
import GlobalReducer from './reducer';
import actions from './actions';
import initialState from './state';
import { actionFunctionGen } from '../../lib/ContextHelper';

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  const actionFunctions = {};

  for (const action of actions) {
    const actionFunction = actionFunctionGen(action, dispatch);
    actionFunctions[actionFunction.name] = actionFunction.fn;
  }

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        ...actionFunctions
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
