import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import Cookies from 'js-cookie'
function Food_detail() {
    const navigate = useNavigate()
    const params = useParams()

    console.log(params)
    const [formData, setFormData] = useState({
        foodId: '',
        foodName: '',
        foodPrice: ''
    })

    const config = {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
    }
    useEffect(() => {
        axios
            .get(`http://localhost:4000/food/print-detailFood/${params.foodId}`, config)
            .then((res) => {
                console.log(res)
                const data = res.data
                setFormData({
                    foodName: data.foodName,
                    foodPrice: data.foodPrice
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.movieId])
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        const config = {
            headers: { Authorization: `Bearer ${Cookies.get('Token')}` }
        }

        const data = {
            foodId: params.foodId,
            foodName: formData.foodName,
            foodPrice: formData.foodPrice
        }
        axios
            .put(`http://localhost:4000/food/update/${params.foodId}`, data, config)
            .then((res) => {
                console.log(res)
                alert('Edit product successfully')
                navigate('/products')
            })
            .catch((err) => {
                console.log(err)
                alert('Edit product failed')
            })
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1 className='title'>Cập Nhật Đồ Ăn</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Tên Đồ Ăn"
                        name="foodName"
                        sx={{ width: 700 }}
                        value={formData.foodName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Giá Tiền"
                        name="foodPrice"
                        onChange={handleChange}
                        value={formData.foodPrice}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                </div>

                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Cập Nhật Đồ Ăn
                </Button>
            </form>
        </Box>
    )
}

export default Food_detail
