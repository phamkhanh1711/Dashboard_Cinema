import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination } from '@mui/material'
import Cookies from 'js-cookie'
import AddIcon from '@mui/icons-material/Add' // Import AddIcon component from Material-UI

import DeleteIcon from '@mui/icons-material/Delete'

import MenuItem from '@mui/material/MenuItem'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Swal from 'sweetalert2'
import UpdateIcon from '@mui/icons-material/Update'

function Products() {
    const [recentOrderData, setRecentOrderData] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)
    const [selectedMovieId, setSelectedMovieId] = useState(null)

    const navigate = useNavigate()
    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

   const Token = Cookies.get('Token')

    const config = {

        headers: {
            Authorization: `Bearer ${Token}`
        }
    }


    const url = 'http://localhost:4000/movie/all-movie'

    useEffect(() => {
        axios
            .get(url,config)
            .then((res) => {
                console.log(res)
                setRecentOrderData(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const handleMenuOpen = (event, movieId) => {
        setAnchorEl(event.currentTarget)
        setSelectedMovieId(movieId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedMovieId(null)
    }

    const handleEdit = () => {
        console.log(selectedMovieId)
        navigate(`/propduct_detail/${selectedMovieId}`)
        handleMenuClose()
    }

    const handleDelete = () => {
        console.log(selectedMovieId)
        const deleteUrl = `http://localhost:4000/movie/delete-movie/${selectedMovieId}`
        axios
            .delete(deleteUrl)
            .then((res) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Delete product successfully'
                })
                setRecentOrderData(recentOrderData.filter((order) => order.movieId !== selectedMovieId))
                handleMenuClose()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleAdd = () => {
        navigate('/add')
        handleMenuClose()
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = recentOrderData.slice(indexOfFirstRow, indexOfLastRow)

    return (
        <>
            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className="text-gray-700 font-medium">Tất cả Phim</strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <table className="w-full text-gray-700">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Phim</th>
                                <th>Thể Loại</th>
                                <th>Hình Ảnh</th>
                                <th>Đạo Diễn</th>
                                <th>Thời Lượng</th>
                                <th>Sản Xuất</th>
                                <th>Actions</th>
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
                                            onClick={(event) => handleMenuOpen(event, order.movieId)}
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
                                            <MenuItem onClick={handleEdit}>
                                                <UpdateIcon />
                                                Update
                                            </MenuItem>
                                            <MenuItem onClick={handleDelete}>
                                                <DeleteIcon />
                                                Delete
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
                    />
                </div>
            </div>
        </>
    )
}

export default Products
