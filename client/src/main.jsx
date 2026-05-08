import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Perfil from './pages/perfil.jsx'
import MinhasMesas from './pages/minhasmesas.jsx'
import Personagens from './pages/personagens.jsx'
import Mesa from './pages/mesa.jsx'
import { AuthProvider } from './context/authContext'
import { PrivateRoute, PublicRoute } from './components/routeGuards.jsx'


const root = createRoot(document.getElementById('root'))
root.render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/perfil"
                        element={
                            <PrivateRoute>
                                <Perfil />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/minhas-mesas"
                        element={
                            <PrivateRoute>
                                <MinhasMesas />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/personagens"
                        element={
                            <PrivateRoute>
                                <Personagens />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/mesa/:id"
                        element={
                            <PrivateRoute>
                                <Mesa />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
)


