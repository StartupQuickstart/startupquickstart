import camcelCase from 'lodash.camelcase';

/**
 * Generates an action function for a given action definition
 *
 * @param {Object} action Action to generate function for
 * @param {Object} dispatch Dispatch object from reducer
 */

export function actionFunctionGen(action, dispatch) {
  const name = camcelCase(action.type);

  const fn = function () {
    const payload = {};

    for (let i = 0; i < action.args?.length; i++) {
      const arg = action.args[i];
      payload[arg] = arguments[i];
    }

    return dispatch({
      type: action.type,
      payload
    });
  };

  return {
    name,
    fn
  };
}
/**
 * Reducer Generators
 */

/**
 * Generates a reducer that simply updates the state
 *
 * @param {Object} action Action to generate reducer for
 * @returns
 */
function setState(action) {
  return function (state, { type, payload }) {
    const newState = { ...state };

    for (let i = 0; i < action.args?.length; i++) {
      const arg = action.args[i];
      newState[arg] = payload[arg];
    }

    return newState;
  };
}

/**
 * Generates a reducer that toggles state
 *
 * @param {Object} action Action to generate reducer for
 * @returns
 */
function toggle(action) {
  return function (state, { type, payload }) {
    const newState = { ...state };

    for (let i = 0; i < action.args?.length; i++) {
      const arg = action.args[i];
      newState[arg] = !state[arg];
    }

    console.log(newState);
    return newState;
  };
}

export const reducerFunctionGens = {
  setState,
  toggle
};

/**
 * Generate reducers for actions if they haev reducerFn set
 *
 * @param {Array} actions Array of action to generate reducers for
 * @returns {Object} Key/value pair of reducers mapped by type
 */
export function generateReducers(actions) {
  const reducers = {};

  for (const action of actions) {
    const reducerFn = reducerFunctionGens[action.reducerFn];

    if (reducerFn) {
      reducers[action.type] = reducerFn(action);
    }
  }

  return reducers;
}
