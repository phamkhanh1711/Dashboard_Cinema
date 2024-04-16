import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
function AddProduct() {
    const navigate = useNavigate()
    const [Movie, setMovie] = useState({
        movieName: '',
        movieCategory: '',
        movieDirector: '',
        movieDescription: '',
        movieActor: '',
        movieDuration: '',
        movieRelease: '',
        movieImage: '',
        language: '',
        movieCountry: ''
    })

    const handleChange = (e) => {
        const nameInput = e.target.name
        const value = e.target.value
        setMovie((state) => ({ ...state, [nameInput]: value }))
    }

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        const imageURL = URL.createObjectURL(imageFile)
        setMovie({ ...Movie, movieImage: imageURL })
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        const formattedDate = format(new Date(Movie.movieRelease), 'yyyy-MM-dd')
        const formData = {
            movieName: Movie.movieName,
            movieCategory: Movie.movieCategory,
            movieDescription: Movie.movieDescription,
            movieDirector: Movie.movieDirector,
            movieActor: Movie.movieActor,
            movieImage: Movie.movieImage,
            movieDuration: parseInt(Movie.movieDuration),
            movieRelease: formattedDate, // Sử dụng ngày tháng đã được định dạng lại
            trailer: Movie.trailer,
            language: Movie.language,
            country: Movie.movieCountry // Sửa lại tên trường thành 'movieCountry'
        }
        try {
            const response = await axios.post('http://localhost:4000/movie/add-movie', formData)
            console.log(response) // In ra dữ liệu trả về từ API
            alert('Thêm phim thành công')
            navigate('/products')
        } catch (error) {
            console.error(error)
            alert('Thêm phim không thành công')
        }
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Movie Name" name="movieName" sx={{ width: 700 }} onChange={handleChange} />
                    <TextField
                        label="Movie Category"
                        name="movieCategory"
                        onChange={handleChange}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Movie Director"
                        name="movieDirector"
                        sx={{ width: 300 }}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Movie Actor"
                        name="movieActor"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Movie Duration"
                        name="movieDuration"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Movie Description"
                        name="movieDescription"
                        sx={{ width: 400 }}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Movie Release"
                        name="movieRelease"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                </div>
                <TextField
                    label="Movie Language"
                    name="language"
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 300 }}
                />
                <TextField
                    label="Movie Country"
                    name="movieCountry"
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 300 }}
                />
                <input type="file" name="movieImage" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Add Product
                </Button>
            </form>
        </Box>
    )
}

export default AddProduct
