const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./public/localStorage/build_data');

localStorage.removeItem('generalData');
