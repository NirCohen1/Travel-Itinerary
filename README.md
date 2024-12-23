# Travel Itinerary

The Travel Itinerary Application is a standalone web application that integrates with Google Maps API to retrieve and display location-based data. The application is built using Vue.js for the frontend and Express.js for the backend

The Travel Itinerary Application allows users to:
-Select their food preferences.
-Retrieve their current location using Geolocation API.
-Search for nearby hotels, restaurants, and attractions.
-Display search results on a map with customized markers for different location types

.
Functional Requirements
  1. User Preferences
    1.1: The system shall provide a list of available cuisines for users to select their food preferences.
    1.2: The system shall allow users to submit their selected food preferences.
  2. Current Location
    2.1: The system shall retrieve the user's current location using the Geolocation API.
    2.2: The system shall handle errors in retrieving the user's current location and provide appropriate feedback to the user.
  3. Search Functionality
    3.1: The system shall allow users to search for hotels, restaurants, and attractions within a specified radius based on their current location and selected preferences.
    3.2: The system shall filter search results based on rating, user reviews, and other relevant criteria.
  4. Map Display
    4.1: The system shall display the search results on a Google Map.
    4.2: The system shall use customized markers for different location types (e.g., hotels, restaurants, attractions).
Non-Functional Requirements
    1. Performance
      1.1: The system shall provide search results within 5 seconds.
      1.2: The system shall support concurrent searches for up to 100 users.
    2. Usability
      2.1: The system shall provide an intuitive and user-friendly interface.
      2.2: The system shall provide clear error messages and instructions to users.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
