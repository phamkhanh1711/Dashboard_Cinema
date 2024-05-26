import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Menu,
    IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Swal from 'sweetalert2'
import UpdateIcon from '@mui/icons-material/Update'
import Cookies from 'js-cookie'
import { CircularProgress } from "@mui/material";
function FoodProduct() {
    const [Foods, setFoods] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [anchorEl, setAnchorEl] = useState(null)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        // Set a timeout to change the loading state after 2 seconds
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000); // 2 seconds delay
    
        // Clear the timeout if the component is unmounted
        return () => clearTimeout(timer);
      }, []);
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

    const handleEditt = (foodId) => {
        console.log(foodId)
        navigate(`/food_detail/${foodId}`)
        handleMenuClose()
    }

    const handleDeletee = (foodId) => {
        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` }
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

    const handleAddd = () => {
        navigate('/addd')
        handleMenuClose()
    }

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const foodRows = Foods.slice(indexOfFirstRow, indexOfLastRow)

    return (
        <>
         {loading ? (
        <CircularProgress className="loading" />
      ) : (
            <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong className='title'>Tất Cả Thức Ăn Nhanh</strong>
                <div className="border-x border-gray-200 rounded-sm mt-3">
                    <TableContainer>
                        <Table className="w-full text-gray-700" aria-label="product food table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Hình Ảnh</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell></TableCell>
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
                                                    Xóa Thức Ăn
                                                </MenuItem>
                                                <MenuItem onClick={() => handleEditt(food.foodId)}>
                                                    <UpdateIcon />
                                                    Cập Nhật Thức Ăn
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <MenuItem onClick={handleAddd}>
                                            <AddIcon /> Tạo Thức Ăn Mới 
                                        </MenuItem>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="pagination-container mt-3">
                        <Pagination
                            count={Math.ceil(Foods.length / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </div>
            )}
        </>
    )
}

export default FoodProduct
