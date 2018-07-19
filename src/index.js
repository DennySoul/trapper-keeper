import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Application from './Application';

import Amplify from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

ReactDOM.render(<Application />, document.getElementById('root'));
