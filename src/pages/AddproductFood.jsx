import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Cookies from 'js-cookie'
import { handleUploadFile } from '../config/uploadImage'
import Swal from 'sweetalert2'
function AddproductFood() {
    const navigate = useNavigate()
    const [Food, setFood] = useState({
        foodName: '',
        foodPrice: '',
        foodImage: ''
    })

    const handleChange = (e) => {
        const nameInput = e.target.name
        const value = e.target.value
        setFood((state) => ({ ...state, [nameInput]: value }))
    }

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        
        setFood({ ...Food,  foodImage: imageFile })
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        let urlImage 
        if(Food.foodImage !== '')
        {
             urlImage = await handleUploadFile(Food.foodImage)
            setFood({ ...Food, foodImage: urlImage })
        }

        const formData = {
            foodName: Food.foodName,
            foodPrice: Food.foodPrice,
            foodImage: urlImage
        }
       
        const Token = Cookies.get('Token')

        // Khai báo các thông tin header
        const config = {
            headers: {
                Authorization: `Bearer ${Token}`, // Thêm token vào header
                'Content-Type': 'application/json' // Xác định kiểu dữ liệu của yêu cầu
            }
        }

        const url = 'http://localhost:4000/food/add-food'

        try {
            const response = await axios.post(url, formData, config) // Truyền config vào axios.post
            console.log(response) // In ra dữ liệu trả về từ API
            Swal.fire({
                icon: 'success',
                title: 'Thêm food thành công',
                showConfirmButton: false,
                timer: 4500
            })
            navigate('/food')
        } catch (error) {
            console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Thêm food thất bại',
                    showConfirmButton: false,
                    timer: 1500
                })
        }
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1>Tạo Đồ Ăn</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Tên Đồ Ăn" name="foodName" sx={{ width: 700 }} onChange={handleChange} />
                    <TextField
                        label="Giá Tiền"
                        name="foodPrice"
                        onChange={handleChange}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                </div>

                <input type="file" name="foodImage" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Thêm Đồ ăn
                </Button>
            </form>
        </Box>
    )
}

export default AddproductFood
