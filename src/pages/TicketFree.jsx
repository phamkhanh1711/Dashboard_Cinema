import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Pagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add' // Import AddIcon component from Material-UI
import MenuItem from '@mui/material/MenuItem'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

function TicketFree() {
    const [ticketData, setTicketData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get('http://localhost:4000/promotion/allPromo')
            .then((response) => {
                console.log(response)
                setTicketData(response.data.data.allPromo)
            })
            .catch((error) => {
                console.error('Error fetching user data:', error)
            })
    }, [])

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleAddd = () => {
        // Handle add action
        console.log('Add ticket free')
        navigate('/addticketfree')
        handleMenuClose()
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const ticketRows = ticketData.slice(indexOfFirstRow, indexOfLastRow)

    return (
        <>
            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className="text-gray-700 font-medium">Vé Khuyến Mãi</strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <TableContainer>
                        <Table className="w-full text-gray-700" aria-label="ticket table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Ảnh Khuyến Mãi</TableCell>
                                    <TableCell>Tên khuyến mãi</TableCell>
                                    <TableCell>Mã khuyến mãi</TableCell>
                                    <TableCell>Giảm giá</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày kết thúc</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ticketRows.map((ticket) => (
                                    <TableRow key={ticket.promotionId}>
                                        <TableCell>{ticket.promotionId}</TableCell>
                                        <TableCell>
                                            <img
                                                src={ticket.imagePromo}
                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                                alt="Promotion"
                                            />
                                        </TableCell>
                                        <TableCell>{ticket.promotionName}</TableCell>
                                        <TableCell>{ticket.code}</TableCell>
                                        <TableCell>{ticket.discount}</TableCell>
                                        <TableCell>{ticket.startDate}</TableCell>
                                        <TableCell>{ticket.endDate}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <MenuItem onClick={handleAddd}>
                                            <AddIcon /> Add
                                        </MenuItem>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="pagination-container mt-3">
                        <Pagination
                            count={Math.ceil(ticketData.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            rowsPerPage={rowsPerPage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TicketFree
