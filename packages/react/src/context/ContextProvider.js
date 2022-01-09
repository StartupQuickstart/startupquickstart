import { combineComponents } from './utils/combineComponents';

import {
  AuthProvider,
  ConfigProvider,
  NavigationProvider,
  NotificationProvider,
  MessageProvider,
  SetupProvider
} from './providers';

const providers = [
  AuthProvider,
  ConfigProvider,
  MessageProvider,
  NavigationProvider,
  NotificationProvider,
  SetupProvider
];

export const ContextProvider = combineComponents(...providers);
