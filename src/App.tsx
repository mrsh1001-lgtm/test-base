import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Colors } from './pages/Colors'
import { ColorDetail } from './pages/ColorDetail'
import { Inspiration } from './pages/Inspiration'
import { InspirationDetail } from './pages/InspirationDetail'
import { Articles } from './pages/Articles'
import { ArticleDetail } from './pages/ArticleDetail'
import { Guides } from './pages/Guides'
import { Dealers } from './pages/Dealers'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="colors" element={<Colors />} />
        <Route path="colors/:slug" element={<ColorDetail />} />
        <Route path="inspiration" element={<Inspiration />} />
        <Route path="inspiration/:slug" element={<InspirationDetail />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:slug" element={<ArticleDetail />} />
        <Route path="guides" element={<Guides />} />
        <Route path="dealers" element={<Dealers />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
