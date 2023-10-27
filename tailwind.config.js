let tailwindConfig = require('@eslovensko/idsk-react/dist/tailwindConfig');
tailwindConfig.content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './utils/**/*.tsx'
];
tailwindConfig.theme.screens.dm1max = { max: tailwindConfig.theme.screens.dm1 };

module.exports = tailwindConfig;
