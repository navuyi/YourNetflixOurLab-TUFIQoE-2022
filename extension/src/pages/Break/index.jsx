import React from 'react';
import { render } from 'react-dom';

import Break from './Break';
import './index.css';

render(<Break />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
