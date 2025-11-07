# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Google Sign-In setup

This project includes a simple Sign in with Google flow using Google Identity Services (GSI). To make it work locally:

1. Register your application in Google Cloud Console and create an OAuth 2.0 Client ID for Web applications.
2. Create a file named `.env` in the project root (frontend/) and add your client id:

```
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

3. Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

4. Open the app in the browser. Click the Google button to sign in. After sign-in you'll see a simple dashboard with a welcome message.

Notes:
- The project uses the Google Identity Services client loaded from `https://accounts.google.com/gsi/client` (script tag added in `index.html`).
- This implementation decodes the ID token client-side to extract the user's name, email and picture. For production you should verify the token server-side as well.

## Admin setup

This app includes a simple admin panel protected by credentials stored in the frontend environment. Add the following to your `.env` in the `frontend/` folder:

```
VITE_ADMIN_USER=thiganth
VITE_ADMIN_PASS=thiganth
```

Change the values for production. The admin panel can approve or disapprove rental requests and add new equipments. Requests and equipment data are stored in `localStorage` for this demo.
