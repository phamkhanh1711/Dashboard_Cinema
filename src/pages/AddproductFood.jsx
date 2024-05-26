import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
    const [errors, setErrors] = useState([])
    const handleChange = (e) => {
        const nameInput = e.target.name
        const value = e.target.value
        setFood((state) => ({ ...state, [nameInput]: value }))
    }
    const [fileName, setFileName] = useState('')
    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        setFileName(imageFile.name)
        setFood({ ...Food, foodImage: imageFile })
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        let errorsSubmit = {}
        let flag = true

        if (Food.foodName === '') {
            errorsSubmit.foodName = 'Tên đồ ăn không được để trống'
            flag = false
        }
        if (Food.foodPrice === '') {
            errorsSubmit.foodPrice = 'Giá tiền không được để trống'
            flag = false
        }

        if (Food.foodImage === 0) {
            errorsSubmit.foodImage = 'Hình ảnh không được để trống'
            flag = false
        } else {
            let size = Food.foodImage.size
            let name = Food.foodImage.name
            if (!name) {
                errorsSubmit.foodImage = 'Vui lòng chọn ảnh có định dạng hợp lệ'
                flag = false
            } else {
                let ext = name.split('.').pop()
                let arrayExt = ['png', 'jpg', 'jpeg']
                if (!arrayExt.includes(ext)) {
                    errorsSubmit.foodImage = "Chỉ được upload file 'png', 'jpg', 'jpeg'"
                    setFood({ ...Food, foodImage: '' })
                    flag = false
                } else if (size > 1024 * 1024) {
                    errorsSubmit.foodImage = 'File quá lớn (tối đa 1MB)'
                    flag = false
                }
            }
        }

        let urlImage
        if (Food.foodImage !== '') {
            urlImage = await handleUploadFile(Food.foodImage)
            setFood({ ...Food, foodImage: urlImage })
        }

        if (!flag) {
            setErrors(errorsSubmit)
            alert('Vui lòng kiểm tra lại thông tin')
            return
        } else {
            setErrors({})
            const formData = {
                foodName: Food.foodName,
                foodPrice: Food.foodPrice,
                foodImage: urlImage
            }

            const Token = Cookies.get('token')

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
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1 className="title">Tạo Đồ Ăn</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Tên Đồ Ăn" name="foodName" sx={{ width: 700 }} onChange={handleChange} />
                    {errors.foodName && <span style={{ color: 'red' }}>{errors.foodName}</span>}
                    <TextField
                        label="Giá Tiền"
                        name="foodPrice"
                        onChange={handleChange}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                    {errors.foodPrice && <span style={{ color: 'red' }}>{errors.foodPrice}</span>}
                </div>


                <Button variant="contained" type="file" component="label" sx={{ width: 150, marginTop: '2%' }}>
                    Upload File
                    <input type="file" name="foodImage" hidden onChange={handleImageChange} />
                </Button>
                {fileName && (
                    <Typography variant="body1" sx={{ marginLeft: 2, marginTop: '2%' }}>
                        {fileName}
                    </Typography>
                )} 


                {errors.foodImage && <span style={{ color: 'red' }}>{errors.foodImage}</span>}
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300, marginTop: '2%' }}>
                    Thêm Đồ ăn
                </Button>
            </form>
        </Box>
    )
}

export default AddproductFood
