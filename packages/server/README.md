# `@startupquickstart/server`

Our server package bootstraps an express server with a default rest api on top of a postgres server.

## Features
- [x] Rest Api
- [x] Local Authentication
- [x] Emails
- [x] Stripe Billing
- [ ] Google Authentication
- [ ] Github Authenticaiton
- [ ] Firebase Authentication

## Usage

```
import server from '@/server';

(() => {
  server.start();
})();
```
