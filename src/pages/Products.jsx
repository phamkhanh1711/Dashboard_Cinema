import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination } from '@mui/material'
import Fab from '@mui/material/Fab' // Import Fab component from Material-UI
import AddIcon from '@mui/icons-material/Add' // Import AddIcon component from Material-UI
import EditIcon from '@mui/icons-material/Edit' // Import EditIcon component from Material-UI
import DeleteIcon from '@mui/icons-material/Delete'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'

function Products() {
    const [recentOrderData, setRecentOrderData] = useState([])
    const [paymentStatus, setPaymentStatus] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)

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

    const url = 'http://localhost:8081/form_add_book'

    useEffect(() => {
        axios
            .get(url)
            .then((res) => {
                console.log(res)
                setRecentOrderData(res.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleEdit = () => {
        // Handle edit action
        console.log('Edit product:')
        handleMenuClose()
    }

    const handleDelete = () => {
        // Handle delete action
        console.log('Delete product:')
        handleMenuClose()
    }

    const handleAdd = () => {
        // Handle add action
        console.log('Add product')
        navigate('/add')
        handleMenuClose()
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = recentOrderData.slice(indexOfFirstRow, indexOfLastRow)

    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">Product Page</strong>
            <div className="border-x border-gray-200 rounded-sm mt-3">
                <table className="w-full text-gray-700">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((order) => (
                            <tr key={order.book_id}>
                                <td>
                                    <Link to={`/order/${order.book_id}`}>{order.book_id}</Link>
                                </td>
                                <td>{order.book_title}</td>
                                <td>{order.category_name}</td>
                                <td>
                                    <img
                                        src={`http://localhost:8081/public/upload/${order.image_path}`}
                                        style={{ maxWidth: '50px', maxHeight: '50px' }}
                                    />
                                </td>
                                <td>{order.price}</td>
                                <td>
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id={`payment-status-label-${order.book_id}`}>Action</InputLabel>{' '}
                                        {/* Change the label */}
                                        <Select
                                            labelId={`payment-status-label-${order.book_id}`}
                                            id={`payment-status-${order.book_id}`}
                                            value={paymentStatus[order.book_id] || ''}
                                            label="Payment Status"
                                            onChange={(event) => handleChange(event, order.book_id)}
                                            style={{
                                                color: paymentStatus[order.book_id] === 'success' ? 'green' : 'red'
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="success">Success</MenuItem>{' '}
                                            {/* Change the menu item labels */}
                                            <MenuItem value="failed">Failed</MenuItem>{' '}
                                        </Select>
                                    </FormControl>
                                </td>
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
                                        <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                        <MenuItem onClick={handleAdd}>
                                            <AddIcon /> Add
                                        </MenuItem>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
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
    )
}

export default Products
