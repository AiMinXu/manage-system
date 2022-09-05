import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux';
import './App.css'
import { store, persistedStore } from './redux/store';
import { PersistGate } from "redux-persist/integration/react";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
