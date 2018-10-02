import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<div>{typeof AudioContext === 'function' ? <App /> : <p class="no-support">Your browser does not support the AudioContext API</p>}</div>, document.getElementById('root'));
registerServiceWorker();
