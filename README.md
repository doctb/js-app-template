# Description

Simple build system for HTML5 applications.

# Requirements

- node 12+

# Boostsrap

```
git clone https://github.com/.../js-app-template
cd js-app-template
npm install
npm run watch-client-dev
```

And open http://localhost:3001 in your browser.

# How to use

- Client code goes in [src/client](src/client)
- Shared code (or static data) between client and server goes in [src/shared](src/shared).
- Assets should go in [src/assets](src/assets).
- Files you want to include wihout any modification in your client build are going in [src/clientHardFiles](src/clientHardFiles).
- `npm run watch-client-dev` serves the client on http://localhost:3001, watches for changes and rebuilds automatically.