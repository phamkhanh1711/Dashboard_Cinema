import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

function MovieShowtimeDetail() {
    const navigate = useNavigate()
    const params = useParams()
    const [formData, setFormData] = useState({
        CreateOn: null,
        startTime: null,
        endTime: null,
        cinemaHallName: '',
        movieName: '',
        priceSeat: '',
        typeName: ''
    })

    const handleDateChange = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            CreateOn: date
        }))
    }

    const handleTimeRangeChange = (newValue) => {
        setFormData((prevState) => ({
            ...prevState,
            startTime: newValue[0],
            endTime: newValue[1]
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    useEffect(() => {
        axios
            .get(`http://localhost:4000/show/detailShow/${params.showId}`)
            .then((res) => {
                const data = res.data.data.detailShow
                setFormData({
                    CreateOn: dayjs(data.CreateOn), // Convert to Day.js object
                    startTime: dayjs(data.startTime, 'HH:mm:ss'), // Convert to Day.js object
                    endTime: dayjs(data.endTime, 'HH:mm:ss'), // Convert to Day.js object
                    cinemaHallName: data.CinemaHall.cinemaHallName,
                    movieName: data.movie.movieName,
                    priceSeat: data.CinemaHallSeats[0].priceSeat,
                    typeName: data.movieType.typeName
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.showId])

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            CreateOn: formData.CreateOn.format('YYYY-MM-DD'),
            startTime: formData.startTime.format('HH:mm:ss'),
            endTime: formData.endTime.format('HH:mm:ss'),
            cinemaHallName: formData.cinemaHallName,
            movieName: formData.movieName,
            priceSeat: formData.priceSeat,
            typeName: formData.typeName
        }
        axios
            .put(`http://localhost:4000/show/updateShow/${params.showId}`, data)
            .then((res) => {
                console.log(res)
                navigate('/movieShowtime')
                Swal.fire({
                    title: 'Cập Nhật Thành Công',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
            })
            .catch((err) => {
                Swal.fire({
                    title: 'Cập Nhật Thất Bại',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            })
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto' }}>
            <h1 className="title">Cập Nhât Lịch Chiếu</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Ngày Chiếu"
                            value={formData.CreateOn}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} sx={{ width: 400 }} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MultiInputTimeRangeField
                            value={[formData.startTime, formData.endTime]}
                            onChange={handleTimeRangeChange}
                            slotProps={{
                                textField: ({ position }) => ({
                                    label: position === 'start' ? 'Từ' : 'Đến'
                                })
                            }}
                            sx={{ mt: 0, ml: 1 }}
                        />
                    </LocalizationProvider>
                </div>
                <Box style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Rạp"
                        id="demo-simple-select"
                        name="cinemaHallName"
                        value={formData.cinemaHallName}
                        onChange={handleChange}
                    />
                </Box>
                <Box sx={{ width: '20%' }}>
                    <TextField
                        label="Thể Loại Phim"
                        name="typeName"
                        value={formData.typeName}
                        sx={{ width: 360, ml: 0 }}
                        onChange={handleChange}
                    />
                </Box>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Tên Phim"
                        name="movieName"
                        value={formData.movieName}
                        sx={{ width: 360, marginLeft: '2px', marginTop: '20px' }}
                        onChange={handleChange}
                    />
                </div>
                <TextField
                    label="Giá Ghế"
                    name="priceSeat"
                    value={formData.priceSeat}
                    sx={{ width: 360, marginLeft: '0%', marginTop: '18px' }}
                    onChange={handleChange}
                />
                <Button variant="contained" type="submit" sx={{ width: 300, marginTop: '20px' }}>
                    Thêm Lịch Chiếu
                </Button>
            </form>
        </Box>
    )
}

export default MovieShowtimeDetail
