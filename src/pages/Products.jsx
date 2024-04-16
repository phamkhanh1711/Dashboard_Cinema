import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination } from '@mui/material'

import AddIcon from '@mui/icons-material/Add' // Import AddIcon component from Material-UI

import DeleteIcon from '@mui/icons-material/Delete'

import MenuItem from '@mui/material/MenuItem'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Swal from 'sweetalert2'
import UpdateIcon from '@mui/icons-material/Update'
import Cookies from 'js-cookie'
function Products() {
    const [recentOrderData, setRecentOrderData] = useState([])
    const [paymentStatus, setPaymentStatus] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)
    const [Foods, setFoods] = useState([])

    const navigate = useNavigate()
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const handleChange = (event, orderId) => {
        setPaymentStatus({ ...paymentStatus, [orderId]: event.target.value })
    }

    const url = 'http://localhost:4000/movie/all-movie'

    useEffect(() => {
        axios
            .get(url)
            .then((res) => {
                console.log(res)
                setRecentOrderData(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const config = {
        headers: { Authorization: `Bearer ${Cookies.get('Token')}` }
    }

    useEffect(() => {
        axios
            .get('http://localhost:4000/food/all-Food')
            .then((response) => {
                console.log(response)
                setFoods(response.data)
            })
            .catch((error) => {
                console.error('Error fetching user data:', error)
            })
    }, [])

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleEdit = (movieId) => {
        console.log(movieId)
        // Handle edit action
        console.log('detail product:')
        navigate(`/propduct_detail/${movieId}`)
        handleMenuClose()
    }

    const handleEditt = (foodId) => {
        console.log(foodId)
        // Handle edit action
        console.log('food detail')
        navigate(`/food_detail/${foodId}`)
        handleMenuClose()
    }

    const handleDelete = (movieId) => {
        console.log(movieId)
        const deleteUrl = `http://localhost:4000/movie/delete-movie/${movieId}`
        console.log(deleteUrl)
        axios
            .delete(deleteUrl)
            .then((res) => {
                console.log(res)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Delete product successfully'
                })
                setRecentOrderData(recentOrderData.filter((order) => order.movieId !== movieId))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleDeletee = (foodId) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('Token')}` }
        }
        console.log(foodId)
        const deleteUrl = `http://localhost:4000/food/delete/${foodId}`
        console.log(deleteUrl)
        axios
            .delete(deleteUrl, config)
            .then((res) => {
                console.log(res)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Delete product successfully'
                })
                setFoods(Foods.filter((food) => food.foodId !== foodId))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleAdd = () => {
        // Handle add action
        console.log('Add product')
        navigate('/add')
        handleMenuClose()
    }

    const handleAddd = () => {
        // Handle add action
        console.log('Add product food')
        navigate('/addd')
        handleMenuClose()
    }
    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = recentOrderData.slice(indexOfFirstRow, indexOfLastRow)

    const foodRows = Foods.slice(indexOfFirstRow, indexOfLastRow)

    return (
        <>
            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className="text-gray-700 font-medium">Product Phim</strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <table className="w-full text-gray-700">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Image</th>
                                <th>Director</th>
                                <th>Duration</th>
                                <th>country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((order) => (
                                <tr key={order.movieId}>
                                    <td>
                                        <Link to={``}>{order.movieId}</Link>
                                    </td>
                                    <td>{order.movieName}</td>
                                    <td>{order.movieCategory}</td>
                                    <td>
                                        <img
                                            src={order.movieImage}
                                            alt={order.movieName}
                                            style={{ maxWidth: '50px', maxHeight: '50px' }}
                                        />
                                    </td>

                                    <td>{order.movieDirector}</td>
                                    <td>{order.movieDuration} Phút</td>
                                    <td>{order.country}</td>

                                    <td>
                                        <IconButton
                                            aria-label="more"
                                            aria-controls="product-menu"
                                            aria-haspopup="true"
                                            onClick={handleMenuOpen}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="product-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => handleDelete(order.movieId)}>
                                                <DeleteIcon />
                                                Delete
                                            </MenuItem>
                                            <MenuItem onClick={() => handleEdit(order.movieId)}>
                                                <UpdateIcon />
                                                Update
                                            </MenuItem>
                                        </Menu>
                                    </td>
                                </tr>
                            ))}

                            <MenuItem onClick={handleAdd}>
                                <AddIcon /> Add
                            </MenuItem>
                        </tbody>
                    </table>
                </div>
                <div className="pagination-container mt-3">
                    <Pagination
                        count={Math.ceil(recentOrderData.length / rowsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </div>
            </div>

            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className="text-gray-700 font-medium">Product Food</strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <TableContainer>
                        <Table className="w-full text-gray-700" aria-label="product food table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {foodRows.map((food) => (
                                    <TableRow key={food.foodId}>
                                        <TableCell>{food.foodId}</TableCell>
                                        <TableCell>{food.foodName}</TableCell>
                                        <TableCell>
                                            <img
                                                src={food.foodImage}
                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                                alt="Food"
                                            />
                                        </TableCell>
                                        <TableCell>{food.foodPrice}.VND</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="product-menu"
                                                aria-haspopup="true"
                                                onClick={handleMenuOpen}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id="product-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={Boolean(anchorEl)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem onClick={() => handleDeletee(food.foodId)}>
                                                    <DeleteIcon />
                                                    Delete
                                                </MenuItem>
                                                <MenuItem onClick={() => handleEditt(food.foodId)}>
                                                    <UpdateIcon />
                                                    Update
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <MenuItem onClick={handleAddd}>
                                    <AddIcon /> Add
                                </MenuItem>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="pagination-container mt-3">
                        <Pagination
                            count={Math.ceil(recentOrderData.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products
