import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MyGamesPage from './pages/MyGamesPage'
import CreateGamePage from './pages/CreateGamePage'
import JoinGamePage from './pages/JoinGamePage'
import GameDashboardPage from './pages/GameDashboardPage'
import ParticipantPagePage from './pages/ParticipantPagePage'
import WishlistGuide from './pages/WishlistGuide'
import HowItWorksPage from './pages/HowItWorksPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import BackOfficePage from './pages/BackOfficePage'
import DatabaseViewer from './pages/DatabaseViewer'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/my-games" element={<MyGamesPage />} />
                <Route path="/backoffice" element={<BackOfficePage />} />
                <Route path="/create" element={<CreateGamePage />} />
                <Route path="/join" element={<JoinGamePage />} />
                <Route path="/game/:gameCode" element={<GameDashboardPage />} />
                <Route path="/participant/:accessCode" element={<ParticipantPagePage />} />
                <Route path="/wishlist-guide" element={<WishlistGuide />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
