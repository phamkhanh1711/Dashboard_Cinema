import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import Cookies from 'js-cookie'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import DeleteIcon from '@mui/icons-material/Delete'
import UpdateIcon from '@mui/icons-material/Update'
import { set } from 'date-fns'
function MovieShowtime() {
    const [showtime, setShowtime] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)
    const [CreateOn, setCreateOn] = useState('')
    const [selectedShowId, setSelectedShowId] = useState(null)

    const navigate = useNavigate()

    const Token = Cookies.get('Token')

    const config = {
        headers: {
            Authorization: `Bearer ${Token}`
        }
    }

    const url = 'http://localhost:4000/show/allShow' // Define the URL for the API call

    useEffect(() => {
        axios
            .get(url, {
                ...config,
                params: {
                    CreateOn: CreateOn
                }
            })
            .then((response) => {
                console.log(response)
                setShowtime(response.data.data.allShow)
            })
            .catch((error) => {
                console.error('Error fetching user data:', error)
            })
    }, [CreateOn])

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const handleMenuOpen = (event, showId) => {
        setAnchorEl(event.currentTarget)
        setSelectedShowId(showId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedShowId(null)
    }
    const handleEdit = () => {
        console.log(selectedShowId)
        navigate(`/movieShowtime_detail/${selectedShowId}`)
        handleMenuClose()
    }

    const handleAddd = () => {
        console.log('Add product showtimes')
        navigate('/addshowtime')
        handleMenuClose()
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = Array.isArray(showtime) ? showtime.slice(indexOfFirstRow, indexOfLastRow) : []

    return (
        <>
            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className='title'>Lịch Chiếu Phim</strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <TableContainer>
                        <Table className="w-full text-gray-700" aria-label="product food table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên Phim</TableCell>
                                    <TableCell>Ngày Chiếu</TableCell>
                                    <TableCell>Thời Gian Bắt Đầu</TableCell>
                                    <TableCell>Thời Gian Kết Thúc</TableCell>
                                    <TableCell>Rạp</TableCell>
                                    <TableCell>Thao Tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentRows.map((row) => (
                                    <TableRow key={row.showId}>
                                        <TableCell>{row.showId}</TableCell>
                                        <TableCell>{row.movie.movieName}</TableCell>
                                        <TableCell>{row.CreateOn}</TableCell>
                                        <TableCell>{row.startTime}</TableCell>
                                        <TableCell>{row.endTime}</TableCell>
                                        <TableCell>{row.CinemaHall.cinemaHallName}</TableCell>

                                        <TableCell>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="product-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleMenuOpen(event, row.showId)}
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
                                                    Chi tiết
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <MenuItem onClick={handleAddd}>
                                            <AddIcon /> Thêm Lịch Chiếu
                                        </MenuItem>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="pagination-container mt-3">
                        <Pagination
                            count={Math.ceil(showtime.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MovieShowtime
