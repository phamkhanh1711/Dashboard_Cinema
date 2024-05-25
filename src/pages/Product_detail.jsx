import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { PieChart } from '@mui/x-charts/PieChart'
import Swal from 'sweetalert2'

function Product_detail() {
    const navigate = useNavigate()
    const params = useParams()

    console.log(params)
    const [formData, setFormData] = useState({
        movieId: '',
        movieName: '',
        movieCategory: '',
        movieDirector: '',
        movieActor: '',
        movieDuration: '',
        movieDescription: '',
        movieRelease: '',
        language: '',
        movieCountry: ''
    })

    useEffect(() => {
        axios
            .get(`http://localhost:4000/movie/detail-movie/${params.movieId}`)
            .then((res) => {
                const data = res.data
                setFormData({
                    movieName: data.movieName,
                    movieCategory: data.movieCategory,
                    movieDirector: data.movieDirector,
                    movieActor: data.movieActor,
                    movieDuration: data.movieDuration,
                    movieDescription: data.movieDescription,
                    movieRelease: data.movieRelease,
                    language: data.language,
                    movieCountry: data.country
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [params.movieId])

    const [sentiment, setSentiment] = useState(null)
    const [tichcuc, setTichcuc] = useState(0)
    const [tieucuc, setTieucuc] = useState(0)

    useEffect(() => {
        axios
            .get(`http://localhost:4000/comment/percent-sentiment/${params.movieId}`)
            .then((res) => {
                console.log(res)
                const data = res.data.data
                setSentiment({
                    percent_pos: parseInt(data.percent_pos),
                    percent_neg: parseInt(data.percent_neg)
                })
                const tichcuc = parseInt(data.percent_neg)
                const tieucuc = parseInt(data.percent_pos)
                setTichcuc(tichcuc)
                setTieucuc(tieucuc)
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

    const handleComment = (movieId) => {
        console.log('danh sachs comment', movieId)
        navigate(`/listcomment/${movieId}`)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formattedDate = format(new Date(formData.movieRelease), 'yyyy-MM-dd')
        const data = {
            movieId: params.movieId,
            movieName: formData.movieName,
            movieCategory: formData.movieCategory,
            movieDirector: formData.movieDirector,
            movieActor: formData.movieActor,
            movieDuration: parseInt(formData.movieDuration),
            movieDescription: formData.movieDescription,
            movieRelease: formattedDate,
            language: formData.language,
            country: formData.movieCountry
        }
        axios
            .put(`http://localhost:4000/movie/update-movie/${params.movieId}`, data)
            .then((res) => {
                console.log(res)
                Swal.fire({
                    icon: 'success',
                    title: 'Cập nhật phim thành công',
                    showConfirmButton: false,
                    timer: 1500
                })

                navigate('/products')
            })
            .catch((err) => {
                console.log(err)
                alert('Edit product failed')
            })
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1 className="title"> Cập Nhật Phim</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Tên Phim"
                        name="movieName"
                        sx={{ width: 700 }}
                        value={formData.movieName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Thể Loại Phim"
                        name="movieCategory"
                        onChange={handleChange}
                        value={formData.movieCategory}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Đạo Diễn Phim"
                        name="movieDirector"
                        sx={{ width: 300 }}
                        value={formData.movieDirector}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Diễn Viên Phim"
                        name="movieActor"
                        sx={{ width: 300, marginLeft: '16px' }}
                        value={formData.movieActor}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Thời Lượng Phim"
                        name="movieDuration"
                        sx={{ width: 300, marginLeft: '16px' }}
                        value={formData.movieDuration}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Mô Tả Phim"
                        name="movieDescription"
                        sx={{ width: 400 }}
                        value={formData.movieDescription}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Ngày Phát Hành Phim"
                        name="movieRelease"
                        sx={{ width: 300, marginLeft: '16px' }}
                        value={formData.movieRelease}
                        onChange={handleChange}
                    />
                </div>
                <TextField
                    label="Ngôn Ngữ Phim"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 300 }}
                />
                <TextField
                    label="Quốc Gia Phim"
                    name="movieCountry"
                    value={formData.movieCountry}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 300 }}
                />

                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300, marginTop: '2%' }}>
                    Cập Nhật Phim
                </Button>
            </form>
            <Button
                onClick={() => handleComment(params.movieId)}
                variant="contained"
                type="submit"
                sx={{ width: 300, marginTop: '2%' }}
            >
                Xem Danh Sách Comment
            </Button>
        </Box>
    )
}

export default Product_detail
