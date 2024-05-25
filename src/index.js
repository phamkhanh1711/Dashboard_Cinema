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
import Customer_detail from './pages/Customer_detail'
import AddproductFood from './pages/AddproductFood'
import Product_detail from './pages/Product_detail'
import Food_detail from './pages/Food_detail'
import FoodProduct from './pages/FoodProduct'
import MovieShowtime from './pages/MovieShowtime'
import AddMovieShowtime from './pages/AddMovieShowtime'
import Booking from './pages/Booking'
import TicketFree from './pages/TicketFree'
import AddTicketFree from './pages/AddTicketFree'
import Booking_detail from './pages/Booking_detail'
import ListComment from './pages/ListComment'
import MovieShowtime_detail from './pages/MovieShowtime_detail'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <Router>
            <App>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/food" element={<FoodProduct />} /> 
                        <Route path="/showtime" element={<MovieShowtime />} />     \
                        <Route path="/addshowtime" element={<AddMovieShowtime/>} />                    
                        <Route path="/add" element={<Addproduct />} />
                        <Route path="/addd" element={<AddproductFood />} />
                        <Route path="/propduct_detail/:movieId" element={<Product_detail />} />
                        <Route path="/food_detail/:foodId" element={<Food_detail />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/customers_detail/:id" element={<Customer_detail />} />
                        <Route path="/booking" element={<Booking />} />
                        <Route path="/ticket" element={<TicketFree />} />
                        <Route path="/addticketfree" element={<AddTicketFree />} />
                        <Route path="/booking_detail/:bookingId" element={<Booking_detail />} />
                        <Route path="/listcomment/:movieId" element={<ListComment />} />
                        <Route path="/movieShowtime_detail/:showId" element={<MovieShowtime_detail />} />
                        </Route>
                    <Route path="/register" element={<Register />} />
                </Routes>
            </App>
        </Router>
    </React.StrictMode>
)
