export const actions = [
  { type: 'SET_FEATURES', args: ['features'], reducerFn: 'setState' },
  { type: 'SET_NOTIFICATIONS', args: ['notifications'], reducerFn: 'setState' },
  { type: 'SET_MESSAGES', args: ['messages'], reducerFn: 'setState' },
  { type: 'SET_USER', args: ['user'], reducerFn: 'setState' },
  { type: 'SET_USER_OPTIONS', args: ['userOptions'], reducerFn: 'setState' },
  { type: 'TOGGLE_SIDEBAR', args: ['sidebarCollapsed'], reducerFn: 'toggle' },
  { type: 'TOGGLE_SIDEBAR_ITEM', args: ['groupIndex', 'itemIndex'] }
];

export default actions;
