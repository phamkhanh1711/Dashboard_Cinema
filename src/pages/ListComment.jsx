import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Cookies from 'js-cookie'
import { PieChart } from '@mui/x-charts/PieChart'
function ListComment() {
    const params = useParams()
    console.log(params)

    const [comments, setComments] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const apiUrl = `http://localhost:4000/comment/${params.movieId}`

        axios
            .get(apiUrl)
            .then((response) => {
                console.log(response)
                setComments(response.data.data.allCommentsOnPost)
            })
            .catch((error) => {
                console.error('Error fetching comments:', error)
            })
    }, [params.movieId])

    const [sentiment, setSentiment] = useState(null)
    const [tichcuc, setTichcuc] = useState(0)
    const [tieucuc, setTieucuc] = useState(0)

    useEffect(() => {
        axios
            .get(`http://localhost:4000/comment/percent-sentiment/${params.movieId}`)
            .then((res) => {
                console.log(res)
                const data = res.data.data
                setSentiment({
                    percent_pos: parseInt(data.percent_pos),
                    percent_neg: parseInt(data.percent_neg)
                })
                const tichcuc = parseInt(data.percent_neg)
                const tieucuc = parseInt(data.percent_pos)
                setTichcuc(tichcuc)
                setTieucuc(tieucuc)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.movieId])

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

    const handleBack = () => {
        navigate(`/propduct_detail/${params.movieId}`)
        handleMenuClose()
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = Array.isArray(comments) ? comments.slice(indexOfFirstRow, indexOfLastRow) : []

    return (
        <>
            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className="text-gray-700 font-medium" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Cảm Xúc Sentiment
                </strong>
                {sentiment && (
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '2%', marginLeft: '25%' }}>
                        <PieChart
                            style={{ color: 'red' }}
                            series={[
                                {
                                    data: [
                                        { id: 'Positive', value: tieucuc, label: '%Tích Cực' },
                                        { id: 'Negative', value: tichcuc, label: '%Tiêu Cực', color: '#ff9800' }
                                    ]
                                }
                            ]}
                            width={400}
                            height={200}
                        />
                    </div>
                )}

                <strong className="text-gray-700 font-medium" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    Danh Sách Bình Luận
                </strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <TableContainer>
                        <Table className="w-full text-gray-700" aria-label="comments table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nội Dung Bình Luận</TableCell>
                                    <TableCell>Cảm Xúc</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentRows.map((row) => (
                                    <TableRow key={row.commentId}>
                                        <TableCell>{row.commentId}</TableCell>
                                        <TableCell>{row.content}</TableCell>
                                        <TableCell>
                                            {row.evaluate === 2 ? (
                                                <span style={{color:"#02B2AF"}}>Tích Cực</span>
                                            ) : (
                                                <span style={{color:"#ff9800"}}>Tiêu Cực</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <MenuItem onClick={handleBack}>
                                            <AddIcon /> Quay Lại
                                        </MenuItem>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="pagination-container mt-3">
                        <Pagination
                            count={Math.ceil(comments.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListComment
