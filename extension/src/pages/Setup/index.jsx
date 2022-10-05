import React from 'react';
import { render } from 'react-dom';

import Setup from './Setup';


render(<Setup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
