import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
import Swal from 'sweetalert2'


function AddMovieShowtime() {
    const navigate = useNavigate()
    const [showtime, setShowtime] = useState({
        CreateOn: '',
        startTime: '',
        endTime: '',
        cinemaHallName: '',
        typeName: '',
        movieName: '',
        priceSeat: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setShowtime((prevState) => ({ ...prevState, [name]: value }))
    }

    const [cinemaHallName, setcinemaHallName] = useState([])

    useEffect(() => {
        getcinemaHallName()
    }, [])

    const getcinemaHallName = async () => {
        try {
            const response = await axios.get('http://localhost:4000/cinemaHall/allCinemaHall')
            console.log(response)
            setcinemaHallName(response.data.allCinemaHall)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        // Kiểm tra tính hợp lệ của giờ bắt đầu và giờ kết thúc
        if (showtime.startTime >= showtime.endTime) {
            alert('Giờ bắt đầu phải nhỏ hơn giờ kết thúc')
            return
        }

        const formData = {
            CreateOn: showtime.CreateOn,
            startTime: showtime.startTime,
            endTime: showtime.endTime,
            cinemaHallName: showtime.cinemaHallName,
            typeName: showtime.typeName,
            movieName: showtime.movieName,
            priceSeat: showtime.priceSeat
        }

        const url = 'http://localhost:4000/show/createShow'

        try {
            const response = await axios.post(url, formData)
            console.log(response)
            Swal.fire({
                icon: 'success',
                title: 'Thêm lịch chiếu thành công',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (error) {
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Thêm lịch chiếu thất bại',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1>Tạo Lịch Chiếu</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Ngày Chiếu" name="CreateOn" sx={{ width: 700 }} onChange={handleChange} />
                    <TextField
                        label="Thời Gian Bắt Đầu"
                        name="startTime"
                        onChange={handleChange}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Thời Gian Kết Thúc" name="endTime" sx={{ width: 700 }} onChange={handleChange} />
                    <select
                        name="cinemaHallName"
                        onChange={handleChange}
                        value={showtime.cinemaHallName} // Changed from cinemaHallName.cinemaHallName
                    >
                        <option value="" disabled>
                        cinemaHallName
                        </option>

                        {cinemaHallName &&
                            cinemaHallName.map((cinemaHall) => (
                                <option key={cinemaHall.cinemaHallId} value={cinemaHall.cinemaHallId}>
                                    {cinemaHall.cinemaHallName}{' '}
                                    {/* Assuming cinemaHallName is the name of the cinema hall */}
                                </option>
                            ))}
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Thể Loại Phim" name="typeName" sx={{ width: 300 }} onChange={handleChange} />
                    <TextField
                        label="Tên Phim"
                        name="movieName"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Giá Ghế"
                        name="priceSeat"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                </div>
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Thêm Lịch Chiếu
                </Button>
            </form>
        </Box>
    )
}

export default AddMovieShowtime
