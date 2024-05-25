import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import { handleUploadFile } from '../config/uploadImage'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import Swal from 'sweetalert2'
import { CircularProgress } from "@mui/material";
function AddTicketFree() {
    const navigate = useNavigate()
    const [ticket, setTicket] = useState({
        code: '',
        promotionName: '',
        description: '',
        discount: '',
        startDate: '',
        endDate: '',
        imagePromo: ''
    })
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Set a timeout to change the loading state after 2 seconds
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000); // 2 seconds delay
    
        // Clear the timeout if the component is unmounted
        return () => clearTimeout(timer);
      }, []);
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        const nameInput = e.target.name
        const value = e.target.value
        setTicket((state) => ({ ...state, [nameInput]: value }))
    }

    const [fileName, setFileName] = useState('')

    const handleImageChange = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            setFileName(file.name)
            setTicket((state) => ({ ...state, imagePromo: file }))
        }
    }

    const handleDateRangeChange = (newValue) => {
        setTicket((prevState) => ({
            ...prevState,
            startDate: newValue[0] ? newValue[0].format('YYYY-MM-DD') : '',
            endDate: newValue[1] ? newValue[1].format('YYYY-MM-DD') : ''
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let errorsSubmit = {}
        let flag = true

        if (ticket.code === '') {
            errorsSubmit.code = 'Mã không được để trống'
            flag = false
        }
        if (ticket.promotionName === '') {
            errorsSubmit.promotionName = 'Tên vé không được để trống'
            flag = false
        }
        if (ticket.description === '') {
            errorsSubmit.description = 'Mô tả không được để trống'
            flag = false
        }
        if (ticket.discount === '') {
            errorsSubmit.discount = 'Giảm giá không được để trống'
            flag = false
        }
        if (ticket.startDate === '' || ticket.endDate === '') {
            errorsSubmit.date = 'Ngày bắt đầu và ngày kết thúc không được để trống'
            flag = false
        }
        if (ticket.imagePromo === '') {
            errorsSubmit.imagePromo = 'Hình ảnh không được để trống'
            flag = false
        } else {
            let size = ticket.imagePromo.size
            let name = ticket.imagePromo.name
            let ext = name.split('.').pop()
            let arrExt = ['jpg', 'jpeg', 'png', 'gif']
            if (!arrExt.includes(ext)) {
                errorsSubmit.imagePromo = 'Hình ảnh không đúng định dạng'
                setTicket({ ...ticket, imagePromo: '' })
                flag = false
            } else if (size > 1024 * 1024) {
                errorsSubmit.imagePromo = 'Hình ảnh không được quá 1MB'
                setTicket({ ...ticket, imagePromo: '' })
                flag = false
            }
        }

        if (ticket.startDate >= ticket.endDate) {
            errorsSubmit.date = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc'
            flag = false
        }

        if (!flag) {
            setErrors(errorsSubmit)
            alert('Vui lòng nhập đầy đủ thông tin')
            return
        }

        let urlImage
        if (ticket.imagePromo) {
            try {
                urlImage = await handleUploadFile(ticket.imagePromo)
            } catch (error) {
                console.error('Image upload failed:', error)
                alert('Upload hình ảnh thất bại')
                return
            }
        }

        setErrors({})
        try {
            const formData = {
                code: ticket.code,
                promotionName: ticket.promotionName,
                description: ticket.description,
                discount: ticket.discount,
                startDate: ticket.startDate,
                endDate: ticket.endDate,
                imagePromo: urlImage
            }

            const response = await axios.post('http://localhost:4000/promotion/ticketfree', formData)
            console.log(response)
            Swal.fire({
                icon: 'success',
                title: 'Tạo vé khuyến mãi thành công',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/ticket')
        } catch (error) {
            console.error(error)
            alert('tạo vé khuyến mãi thất bại')
        }
    }

    return (
       <>
        {loading ? (
                <CircularProgress className="loading" />
            ) : (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1 className='title'>Tạo Vé Khuyến Mãi</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Mã" name="code" sx={{ width: 400 }} onChange={handleChange} />
                    {errors.code && <span style={{ color: 'red' }}>{errors.code}</span>}
                    <TextField
                        label="Tên Vé Khuyen Mai"
                        name="promotionName"
                        onChange={handleChange}
                        sx={{ width: 400, marginLeft: '16px' }}
                    />
                    {errors.promotionName && <span style={{ color: 'red' }}>{errors.promotionName}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Giới thiệu" name="description" sx={{ width: 400 }} onChange={handleChange} />
                    {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
                    <TextField
                        label="Giảm giá"
                        name="discount"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                    {errors.discount && <span style={{ color: 'red' }}>{errors.discount}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateRangePicker']}>
                            <DateRangePicker
                                localeText={{ start: 'Ngày bắt đầu', end: 'Ngày kết thúc' }}
                                onChange={handleDateRangeChange}
                            />
                            {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                <Button variant="contained" type="file" component="label" sx={{ width: 150, marginTop: '2%' }}>
                    Upload File
                    <input type="file" name="imagePromo" hidden onChange={handleImageChange} />
                </Button>
                {fileName && (
                    <Typography variant="body1" sx={{ marginLeft: 2, marginTop: '2%' }}>
                        {fileName}
                    </Typography>
                )}
                {errors.imagePromo && <span style={{ color: 'red' }}>{errors.imagePromo}</span>}

                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300, marginTop: '2%' }}>
                    Tạo Vé Khuyến Mãi
                </Button>
            </form>
        </Box>
         )}
       </>
    )
}

export default AddTicketFree
