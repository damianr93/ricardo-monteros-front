import React, { useEffect, useRef } from 'react'
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import { AppRouter } from './routes/AppRouter'
import Footer from './components/Footer'
import { Provider, useDispatch } from 'react-redux'
import { store, AppDispatch } from './store/store'
import { ToastContainer } from 'react-toastify';
import { initializeAuth } from './store/logged/thunks';

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(initializeAuth());
    }
  }, []); // Removido dispatch de las dependencias

  return (
    <>
      <Navbar />
      <AppRouter />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
)

export default App