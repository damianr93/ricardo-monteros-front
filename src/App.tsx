import React from 'react'
import Navbar from './components/Navbar'
import { AppRouter } from './routes/AppRouter'
import Footer from './components/Footer'
import { Provider } from 'react-redux'
import { store } from './store/store'

const App: React.FC = () => (
  <Provider store={store}>
    <Navbar />
    <AppRouter />
    <Footer />
  </Provider>
)

export default App