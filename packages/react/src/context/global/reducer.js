import actions from './actions';
import { generateReducers } from '../../lib/ContextHelper';

const reducers = generateReducers(actions);

export default function GlobalReducer(state, { type, payload }) {
  if (reducers[type]) {
    return reducers[type](state, { type, payload });
  } else {
    switch (type) {
      /**
       * Toggles a sidebar item
       */
      case 'TOGGLE_SIDEBAR_ITEM':
        const sidebarItems = JSON.parse(JSON.stringify(state.sidebarItems));
        const item = sidebarItems[payload.groupIndex].items[payload.itemIndex];

        if (item.collapsed === undefined || item.collapsed === true) {
          item.collapsed = false;
        } else {
          item.collapsed = true;
        }

        return { ...state, sidebarItems };

      default:
        return state;
    }
  }
}
