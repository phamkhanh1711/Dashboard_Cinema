import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App'
import Layout from './components/shared/Layout'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Addproduct from './pages/Addproduct'
import Customers from './pages/Customers'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Router>
            <App>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/add" element={<Addproduct />} />
                        <Route path="/customers" element={<Customers />} />
                    </Route>
                    <Route path="/register" element={<Register />} />
                </Routes>
            </App>
        </Router>
    </React.StrictMode>
)
