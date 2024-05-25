import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

function AddMovieShowtime() {
    const navigate = useNavigate()
    const [showtime, setShowtime] = useState({
        CreateOn: null,
        startTime: '',
        endTime: '',
        cinemaHallName: '',
        typeName: '',
        movieName: '',
        priceSeat: ''
    })
    const [errors, setErrors] = useState([])
    const handleChange = (e) => {
        const { name, value } = e.target
        setShowtime((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleDateChange = (date) => {
        setShowtime((prevState) => ({
            ...prevState,
            CreateOn: date
        }))
    }

    const handleTimeRangeChange = (newValue) => {
        setShowtime((prevState) => ({
            ...prevState,
            startTime: newValue[0] ? newValue[0].format('HH:mm') : '',
            endTime: newValue[1] ? newValue[1].format('HH:mm') : ''
        }))
    }

    const [cinemaHallName, setCinemaHallName] = useState([])

    useEffect(() => {
        getCinemaHallName()
    }, [])

    const getCinemaHallName = async () => {
        try {
            const response = await axios.get('http://localhost:4000/cinemaHall/allCinemaHall')
            console.log(response)
            setCinemaHallName(response.data.allCinemaHall)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let errorsSubmit = {}
        let flag = true

        if (showtime.CreateOn === null) {
            errorsSubmit.CreateOn = 'Vui lòng chọn ngày chiếu'
            flag = false
        }
        if (showtime.startTime === '') {
            errorsSubmit.startTime = 'Vui lòng chọn giờ bắt đầu'
            flag = false
        } else if (showtime.endTime === '') {
            errorsSubmit.endTime = 'Vui lòng chọn giờ kết thúc'
            flag = false
        } else if (showtime.startTime >= showtime.endTime) {
            errorsSubmit.time = 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc'
            flag = false
        }
        if (showtime.cinemaHallName === '') {
            errorsSubmit.cinemaHallName = 'Vui lòng chọn rạp'
            flag = false
        }
        if (showtime.typeName === '') {
            errorsSubmit.typeName = 'Vui lòng nhập thể loại phim'
            flag = false
        }
        if (showtime.movieName === '') {
            errorsSubmit.movieName = 'Vui lòng nhập tên phim'
            flag = false
        }
       
        if (showtime.priceSeat === '') {
            errorsSubmit.priceSeat = 'Vui lòng nhập giá ghế'
            flag = false
        } else if (isNaN(showtime.priceSeat)) {
            errorsSubmit.priceSeat = 'Giá ghế phải là số'
            flag = false
        }

        if (!flag) {
            setErrors(errorsSubmit)
            alert('Vui lòng nhập đầy đủ thông tin')
            return
        } else {
            setErrors({})
            try {
                const formData = {
                    CreateOn: showtime.CreateOn.format('YYYY-MM-DD'),
                    startTime: showtime.startTime,
                    endTime: showtime.endTime,
                    cinemaHallName: showtime.cinemaHallName,
                    typeName: showtime.typeName,
                    movieName: showtime.movieName,
                    priceSeat: showtime.priceSeat
                }
                const response = await axios.post('http://localhost:4000/show/createShow', formData)
                console.log(response)
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate('/showtime')
            } catch (error) {
                console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: error.response.data.message
                })  
            }
        }
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1>Tạo Lịch Chiếu</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Ngày Chiếu"
                                value={showtime.CreateOn}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} sx={{ width: 400 }} />}
                            />
                            {errors.CreateOn && (
                                <p style={{ color: 'red', marginTop: '15%', marginLeft: '-50%' }}>{errors.CreateOn}</p>
                            )}
                        </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MultiInputTimeRangeField']} sx={{ mt: 0, ml: 1 }}>
                            <MultiInputTimeRangeField
                                slotProps={{
                                    textField: ({ position }) => ({
                                        label: position === 'start' ? 'Từ' : 'Đến'
                                    })
                                }}
                                onChange={handleTimeRangeChange}
                            />
                            {errors.startTime && <p style={{ color: 'red' }}>{errors.startTime}</p>}
                            {errors.endTime && <p style={{ color: 'red' }}>{errors.endTime}</p>}
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <FormControl style={{ width: '40%' }}>
                        <InputLabel id="demo-simple-select-label">Chọn Rạp</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="cinemaHallName"
                            label="Age"
                            onChange={handleChange}
                        >
                            {cinemaHallName.map((item) => (
                                <MenuItem key={item._id} value={item.cinemaHallName}>
                                    {item.cinemaHallName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {errors.cinemaHallName && (
                        <p style={{ color: 'red', marginTop: '7%', marginLeft: '-35%' }}>{errors.cinemaHallName}</p>
                    )}
                </Box>
                <Box sx={{ width: '20%' }}>
                    <TextField
                        label="Thể Loại Phim"
                        name="typeName"
                        sx={{ width: 360, ml: 0 }}
                        onChange={handleChange}
                    />
                    {errors.typeName && (
                        <p style={{ color: 'Red', color: 'red', marginTop: '9%', marginLeft: '-14%' }}>
                            {errors.typeName}
                        </p>
                    )}
                </Box>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Tên Phim"
                        name="movieName"
                        sx={{ width: 360, marginLeft: '2px', marginTop: '20px' }}
                        onChange={handleChange}
                    />
                    {errors.movieName && (
                        <p style={{ color: 'red', marginTop: '9%', marginLeft: '-35%' }}>{errors.movieName}</p>
                    )}
                </div>
                <TextField
                    label="Giá Ghế"
                    name="priceSeat"
                    sx={{ width: 360, marginLeft: '0%', marginTop: '18px' }}
                    onChange={handleChange}
                />
                {errors.priceSeat && <p style={{ width: '20%', color: 'red' }}>{errors.priceSeat}</p>}
                <Button variant="contained" type="submit" sx={{ width: 300, marginTop: '20px    ' }}>
                    Thêm Lịch Chiếu
                </Button>
            </form>
        </Box>
    )
}

export default AddMovieShowtime
