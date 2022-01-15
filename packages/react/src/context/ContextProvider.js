import { combineComponents } from './utils/combineComponents';

import {
  AuthProvider,
  ApiProvider,
  ConfigProvider,
  NavigationProvider,
  NotificationProvider,
  MessageProvider,
  SetupProvider
} from './providers';

const providers = [
  AuthProvider,
  ApiProvider,
  ConfigProvider,
  MessageProvider,
  NavigationProvider,
  NotificationProvider,
  SetupProvider
];

export const ContextProvider = combineComponents(...providers);
