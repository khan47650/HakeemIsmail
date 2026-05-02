import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import Articles from './pages/Articles';
import Shorts from './pages/Shorts';
import About from './pages/About';
import Contact from './pages/Contact';
import Videos from './pages/Videos';

import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './components/admin/AdminDashboard';
import PendingOrders from './components/admin/PendingOrders';
import CompletedOrders from './components/admin/CompletedOrders';
import AdminProducts from './components/admin/AdminProducts';
import AdminArticles from './components/admin/AdminArticles';
import AdminVideos from './components/admin/AdminVideos';
import AdminShorts from './components/admin/AdminShorts';
import Messages from './components/admin/Messages';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin" element={<AdminPanel />}>
          {/* <Route index element={<AdminDashboard />} /> */}
          <Route index element={<PendingOrders />} />
          <Route path="pending-orders" element={<PendingOrders />} />
          <Route path="completed-orders" element={<CompletedOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="shorts" element={<AdminShorts />} />
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>

      {!isAdminPage && <Footer />}

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;