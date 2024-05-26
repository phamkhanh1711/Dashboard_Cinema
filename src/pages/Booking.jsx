import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Menu from '@mui/material/Menu'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MenuItem from '@mui/material/MenuItem'
import DeleteIcon from '@mui/icons-material/Delete'
import UpdateIcon from '@mui/icons-material/Update'
import { format } from 'date-fns'
import SearchIcon from '@mui/icons-material/Search'
import { HiOutlineSearch } from 'react-icons/hi'
import Cookies from 'js-cookie'

function Booking() {
    const [bookingData, setBookingData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [selectedBookingId, setSelectedBooking] = useState(null)

    const navigate = useNavigate()
    const searchRef = useRef(null)

    const Token = Cookies.get('token')
    const config = {
        headers: {
            Authorization: `Bearer ${Token}`
        }
    }

    const url = 'http://localhost:4000/booking/admin/allBooking'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url, config)
                console.log('Booking data:', response)
                const sortedData = response.data.data.getAllBooking.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )

                setBookingData(sortedData)
                localStorage.setItem('bookingData', JSON.stringify(sortedData)) // Save data to local storage
            } catch (error) {
                console.error('Error fetching booking data:', error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSearch = async () => {
        try {
            if (!searchTerm.trim()) {
                console.error('Search term is required.')
                return
            }

            const response = await axios.get(`http://localhost:4000/booking/searchBooking`, {
                params: {
                    bookingId: searchTerm
                }
            })
            console.log(response)
            setSearchResults(response.data.data.bookingResult)
            setShowResults(true)
            setIsSearchActive(true)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleResultClick = (bookingId) => {
        navigate(`/booking_detail/${bookingId}`)
        setShowResults(false)
    }

    const handleMenuOpen = (event, bookingId) => {
        setAnchorEl(event.currentTarget)
        setSelectedBooking(bookingId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedBooking(null)
    }

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const handleEdit = () => {
        console.log(selectedBookingId)
        navigate(`/booking_detail/${selectedBookingId}`)
        handleMenuClose()
    }

    const handleDelete = (userId) => {
        console.log(userId)
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = (isSearchActive ? searchResults : bookingData).slice(indexOfFirstRow, indexOfLastRow)

    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
            <strong className='title'>Lịch Sử Đặt Vé</strong>
            <div className="relative" style={{ float: 'right', position: 'relative' }} ref={searchRef}>
                <HiOutlineSearch fontSize={20} className="text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm focus:outline-none active:outline-none border border-gray-300 w-[24rem] h-10 pl-11 pr-4 rounded-sm"
                />
                <button onClick={handleSearch}>
                    <SearchIcon />
                </button>
                {showResults && (
                    <div className="absolute z-10 bg-white w-[24rem] border border-gray-300 rounded-sm mt-1">
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <div
                                    key={result.bookingId}
                                    className="p-2.5 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleResultClick(result.bookingId)}
                                >
                                    {result.bookingId}
                                </div>
                            ))
                        ) : (
                            <div className="p-2.5">No results found</div>
                        )}
                    </div>
                )}
            </div>
            <div className="border-x border-gray-200 rounded-sm mt-3">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Mã Lấy Vé</TableCell>
                                <TableCell>Họ Tên</TableCell>
                                <TableCell>Phim</TableCell>
                                <TableCell>Ngày Chiếu</TableCell>
                                <TableCell>Giờ Chiếu</TableCell>
                                <TableCell>Thời Gian Đã Đặt Vé</TableCell>
                                <TableCell>Thao Tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRows.map((booking, index) => {
                                const globalIndex = indexOfFirstRow + index + 1

                                return (
                                    <TableRow key={globalIndex}>
                                        <TableCell>{globalIndex}</TableCell>
                                        <TableCell>{booking.bookingId}</TableCell>
                                        <TableCell>{booking.User ? booking.User.fullName : 'Unknown'}</TableCell>
                                        <TableCell>
                                            {booking.BookingTickets[0].Show
                                                ? booking.BookingTickets[0].Show.movie.movieName
                                                : 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            {booking.BookingTickets[0].Show
                                                ? booking.BookingTickets[0].Show.CreateOn
                                                : 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            {booking.BookingTickets[0].Show
                                                ? booking.BookingTickets[0].Show.startTime
                                                : 'Unknown'}{' '}
                                            ~
                                            {booking.BookingTickets[0].Show
                                                ? booking.BookingTickets[0].Show.endTime
                                                : 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                aria-label="more"
                                                aria-controls="product-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleMenuOpen(event, booking.bookingId)}
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
                                                <MenuItem onClick={() => handleDelete(booking.userId)}>
                                                    <DeleteIcon />
                                                    Huỷ vé
                                                </MenuItem>
                                                <MenuItem onClick={handleEdit}>
                                                    <UpdateIcon />
                                                    Chi tiết
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="pagination-container mt-3">
                    <Pagination
                        count={Math.ceil((isSearchActive ? searchResults : bookingData).length / rowsPerPage)}
                        page={currentPage}
                        onChange={handleChangePage}
                    />
                </div>
            </div>
        </div>
    )
}

export default Booking
