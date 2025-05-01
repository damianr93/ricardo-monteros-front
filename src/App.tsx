import React from 'react'
import Navbar from './components/Navbar'
import { AppRouter } from './routes/AppRouter'
import Footer from './components/Footer'

const App: React.FC = () => (
  <>
    <Navbar />
    <AppRouter />
    <Footer />
  </>
)

export default App