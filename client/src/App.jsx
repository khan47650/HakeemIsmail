import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Products from './pages/Products'
import Articles from './pages/Articles'
import Shorts from './pages/Shorts'
import About from './pages/About'
import Contact from './pages/Contact'
import Videos from './pages/Videos'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path='/videos' element={<Videos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App