import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/Store.js';
import { I18nextProvider } from 'react-i18next';
import i18n from '../Language/translate.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              <App />
            </div>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

renderApp();

i18n.on('languageChanged', () => {
  renderApp();
});