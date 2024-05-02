import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Cookies from 'js-cookie'
import { Create, Star } from '@mui/icons-material'

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
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setShowtime((prevState) => ({ ...prevState, [name]: value }));
        }

        


        const [cinemaHallName, setcinemaHallName] = useState([]);

        useEffect(() => {
            getcinemaHallName();
        }, []);
    
        const getcinemaHallName = async () => {
            try {
                const response = await axios.get('http://localhost:4000/cinemaHall/allCinemaHall');
                console.log(response);
                setcinemaHallName(response.data.allCinemaHall);
            } catch (error) {
                console.error(error);
            }
        };
        

        const handleSubmit = async (event) => {
            event.preventDefault();

            // Kiểm tra tính hợp lệ của giờ bắt đầu và giờ kết thúc
            if (showtime.startTime >= showtime.endTime) {
                alert('Giờ bắt đầu phải nhỏ hơn giờ kết thúc');
                return;
            }

            const formData = {
                CreateOn: showtime.CreateOn,
                startTime: showtime.startTime,
                endTime: showtime.endTime,
                cinemaHallName: showtime.cinemaHallName,
                typeName: showtime.typeName,
                movieName: showtime.movieName,
                priceSeat: showtime.priceSeat
            };

            const url = 'http://localhost:4000/show/createShow';

            try {
                const response = await axios.post(url, formData);
                console.log(response);
                alert('Thêm lịch chiếu thành công');
            } catch (error) {
                console.error(error);
                alert('Thêm lịch chiếu không thành công');
            }
        }

        return (
            <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
                <h1>Add Movie Showtime</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                        <TextField label="CreateOn" name="CreateOn" sx={{ width: 700 }} onChange={handleChange} />
                        <TextField label="startTime" name="startTime" onChange={handleChange} sx={{ width: 700, marginLeft: '16px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                        <TextField label="endTime" name="endTime" sx={{ width: 700 }} onChange={handleChange} />
                        <select
    name="cinemaHallName"
    onChange={handleChange}
    value={cinemaHallName} // Changed from cinemaHallName.cinemaHallName
>
    <option value="" disabled hidden>
        Please choose a cinema hall ...
    </option>
    {cinemaHallName && cinemaHallName.map((cinemaHall) => (
        <option key={cinemaHall.cinemaHallId} value={cinemaHall.cinemaHallId}>
            {cinemaHall.cinemaHallName} {/* Assuming cinemaHallName is the name of the cinema hall */}
        </option>
    ))}
</select>
            </div>
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                        <TextField label="typeName" name="typeName" sx={{ width: 300 }} onChange={handleChange} />
                        <TextField label="movieName" name="movieName" sx={{ width: 300, marginLeft: '16px' }} onChange={handleChange} />
                        <TextField label="priceSeat" name="priceSeat" sx={{ width: 300, marginLeft: '16px' }} onChange={handleChange} />
                    </div>
                    <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                        Add Showtime
                    </Button>
                </form>
            </Box>
        )
    }


export default AddMovieShowtime;
