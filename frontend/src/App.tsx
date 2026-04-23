import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Navbar           from './components/layout/Navbar'
import Footer           from './components/layout/Footer'
import CartDrawer       from './components/layout/CartDrawer'
import CustomCursor     from './components/ui/CustomCursor'

import HomePage         from './pages/HomePage'
import CollectionPage   from './pages/CollectionPage'
import ConceptPage      from './pages/ConceptPage'
import EditorialsPage   from './pages/EditorialsPage'
import LookbookPage     from './pages/LookbookPage'
import PreorderPage     from './pages/PreorderPage'
import CheckoutPage     from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import AuthPage         from './pages/AuthPage'
import AccountPage      from './pages/AccountPage'
import AdminPage        from './pages/AdminPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="grain min-h-screen flex flex-col">
            <CustomCursor />
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/"               element={<HomePage />} />
                <Route path="/collection"     element={<CollectionPage />} />
                <Route path="/concept"        element={<ConceptPage />} />
                <Route path="/editorials"     element={<EditorialsPage />} />
                <Route path="/lookbook"       element={<LookbookPage />} />
                <Route path="/preorder"       element={<PreorderPage />} />
                <Route path="/checkout"       element={<CheckoutPage />} />
                <Route path="/order-success"  element={<OrderSuccessPage />} />
                <Route path="/login"          element={<AuthPage />} />
                <Route path="/account"        element={<AccountPage />} />
                <Route path="/admin"          element={<AdminPage />} />
              </Routes>
            </div>
            <Footer />
            <CartDrawer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
