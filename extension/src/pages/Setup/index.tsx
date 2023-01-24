import React from 'react';
import { render } from 'react-dom';
import Setup from './Setup';
import { Provider } from 'react-redux';
import store from './redux/store';

render(<Provider store={store}> <Setup /> </Provider>, window.document.querySelector('#app-container'));

