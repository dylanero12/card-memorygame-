# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Memory Card Game

A fun memory card game where you try to click each character card exactly once. The cards shuffle after each click!

## Environment Variables

This project uses environment variables to configure the API URL. The environment variables are stored in the `.env` file in the `src` directory.

### Available Environment Variables

- `VITE_API_URL`: The URL of the character cards API. Default: `https://apiforcards-k9iu.vercel.app`

### Changing Environment Variables

To change the API URL:

1. Edit the `.env` file in the `src` directory
2. Update the `VITE_API_URL` value to your desired API URL
3. Restart the development server

### Using Environment Variables in Development

When running the app in development mode, Vite automatically loads the environment variables from the `.env` file.

### Using Environment Variables in Production

For production deployment, you'll need to set the environment variables according to your hosting platform's instructions.

## Development

To run the app in development mode:

```bash
npm install
npm run dev
```

## Production Build

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
