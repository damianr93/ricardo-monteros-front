import React from 'react'
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import { AppRouter } from './routes/AppRouter'
import Footer from './components/Footer'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => (
  <Provider store={store}>
    <Navbar />
    <AppRouter />
    <Footer />
    <ToastContainer position="top-right" autoClose={3000} />
  </Provider>
)

export default App