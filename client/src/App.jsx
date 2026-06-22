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
import Blogs from './pages/Blogs';

import AdminPanel from './pages/AdminPanel';
import PendingOrders from './pages/admin/PendingOrders';
import CompletedOrders from './pages/admin/CompletedOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminArticles from './pages/admin/AdminArticles';
import AdminVideos from './pages/admin/AdminVideos';
import AdminShorts from './pages/admin/AdminShorts';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminCategories from './pages/admin/AdminCategories';
import Messages from './pages/admin/Messages';
import ProductDetailPage from './components/ProductDetailPage';
import BlogDetailPage from './components/BlogDetailPage';
import AdminVideoForm from './pages/admin/AdminVideoForm';
import AdminShortForm from './components/admin/AdminShortForm';
import AdminProductForm from "./components/admin/AdminProductForm";
import AdminArticleForm from './components/admin/AdminArticleForm';
import AdminBlogForm from './components/admin/AdminBlogForm';
import RegisteredClinic from "./pages/RegisteredClinic";
import DeliveryInfo from "./pages/DeliveryInfo";

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const isDetailPage =
    /^\/products\/[^/]+$/.test(location.pathname) ||
    /^\/blogs\/[^/]+$/.test(location.pathname);

  const isInfoPage =
    location.pathname === '/clinic' || location.pathname === '/delivery';

  return (
    <AuthProvider>

      {!isAdminPage && !isDetailPage && !isInfoPage && <Header />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/clinic" element={<RegisteredClinic />} />
        <Route path="/delivery" element={<DeliveryInfo />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />


        {/* PROTECTED ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<PendingOrders />} />
          <Route path="pending-orders" element={<PendingOrders />} />
          <Route path="completed-orders" element={<CompletedOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="shorts" element={<AdminShorts />} />
          <Route path="messages" element={<Messages />} />
          <Route path="/admin/videos/new" element={<AdminVideoForm />} />
          <Route path="/admin/videos/edit/:id" element={<AdminVideoForm />} />
          <Route path="/admin/shorts/new" element={<AdminShortForm />} />
          <Route path="/admin/shorts/edit/:id" element={<AdminShortForm />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
          <Route path="/admin/articles/new" element={<AdminArticleForm />} />
          <Route path="/admin/articles/edit/:id" element={<AdminArticleForm />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/blogs/new" element={<AdminBlogForm />} />
          <Route path="/admin/blogs/edit/:id" element={<AdminBlogForm />} />
          <Route path="/admin/categories" element={<AdminCategories />} />

        </Route>
      </Routes>

      {!isAdminPage && <Footer />}

      <ToastContainer position="top-right" autoClose={2000} />

    </AuthProvider>
  );
}

export default App;