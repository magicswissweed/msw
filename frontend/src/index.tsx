import React from 'react';
import ReactDOM from 'react-dom/client';
import {MswOverviewPage} from './overview/MswOverviewPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MswOverviewPage />
  </React.StrictMode>
);
