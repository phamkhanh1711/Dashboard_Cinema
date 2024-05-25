import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { handleUploadFile } from '../config/uploadImage'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import Swal from 'sweetalert2'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
function AddProduct() {
    const navigate = useNavigate()
    const [Movie, setMovie] = useState({
        movieName: '',
        movieCategory: '',
        movieDirector: '',
        movieDescription: '',
        movieActor: '',
        movieDuration: '',
        movieRelease: null,
        movieImage: '',
        language: '',
        movieCountry: '',
        movieType: ''
    })
    const [errors, setErrors] = useState([])
    const handleChange = (e) => {
        const nameInput = e.target.name
        const value = e.target.value
        setMovie((state) => ({ ...state, [nameInput]: value }))
    }
    const [fileName, setFileName] = useState('')
    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        setFileName(imageFile.name)
        setMovie({ ...Movie, movieImage: imageFile })
    }

    const handleDateChange = (date) => {
        setMovie((prevState) => ({
            ...prevState,
            movieRelease: date ? date : null // Ensure dayjs object or null
        }))
    }

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result.split(',')[1]) // Loại bỏ phần header của base64
            reader.onerror = (error) => reject(error)
        })
    }
    const [movieType, setMovieType] = useState([])

    useEffect(() => {
        getMovieType()
    }, [])

    const getMovieType = async () => {
        try {
            const response = await axios.get('http://localhost:4000/movie/movieType')
            console.log(response)
            setMovieType(response.data.allMovieType) // Đảm bảo truy cập vào response.data.allMovieType
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        let errorsSubmit = {}
        let flag = true

        if (Movie.movieName === '') {
            errorsSubmit.movieName = 'Vui lòng nhập tên phim'
            flag = false
        }
        if (Movie.movieCategory === '') {
            errorsSubmit.movieCategory = 'Vui lòng nhập thể loại phim'
            flag = false
        }
        if (Movie.movieDirector === '') {
            errorsSubmit.movieDirector = 'Vui lòng nhập tên đạo diễn'
            flag = false
        }
        if (Movie.movieDescription === '') {
            errorsSubmit.movieDescription = 'Vui lòng nhập mô tả phim'
            flag = false
        }
        if (Movie.movieActor === '') {
            errorsSubmit.movieActor = 'Vui lòng nhập tên diễn viên'
            flag = false
        }
        if (Movie.movieDuration === '') {
            errorsSubmit.movieDuration = 'Vui lòng nhập thời lượng phim'
            flag = false
        }
        if (Movie.movieRelease === '') {
            errorsSubmit.movieRelease = 'Vui lòng nhập ngày ra mắt'
            flag = false
        }
        if (Movie.language === '') {
            errorsSubmit.language = 'Vui lòng nhập ngôn ngữ/ phụ đề phim'
            flag = false
        }
        if (Movie.movieCountry === '') {
            errorsSubmit.movieCountry = 'Vui lòng nhập quốc gia phim'
            flag = false
        }
        if (Movie.movieImage === 0) {
            errorsSubmit.movieImage = 'Vui lòng chọn ảnh'
            flag = false
        } else {
            let size = Movie.movieImage.size
            let name = Movie.movieImage.name
            if (!name) {
                errorsSubmit.movieImage = 'Vui lòng chọn ảnh có định dạng hợp lệ'
                flag = false
            } else {
                let ext = name.split('.').pop()
                let arrayExt = ['png', 'jpg', 'jpeg']
                if (!arrayExt.includes(ext)) {
                    errorsSubmit.movieImage = "Chỉ được upload file 'png', 'jpg', 'jpeg'"
                    setMovie({ ...Movie, movieImage: '' })
                    flag = false
                } else if (size > 1024 * 1024) {
                    errorsSubmit.movieImage = 'File quá lớn (tối đa 1MB)'
                    flag = false
                }
            }
        }

        let urlImage
        if (Movie.movieImage !== '') {
            urlImage = await handleUploadFile(Movie.movieImage)
            setMovie({ ...Movie, movieImage: urlImage })
        }

        if (!flag) {
            setErrors(errorsSubmit)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Thêm phim thất bại'
            })
        } else {
            setErrors({})

            try {
                const formData = {
                    movieName: Movie.movieName,
                    movieCategory: Movie.movieCategory,
                    movieDirector: Movie.movieDirector,
                    movieDescription: Movie.movieDescription,
                    movieActor: Movie.movieActor,
                    movieDuration: Movie.movieDuration,
                    movieRelease: Movie.movieRelease,
                    movieImage: urlImage,
                    language: Movie.language,
                    movieCountry: Movie.movieCountry,
                    movieType: selected
                }
                console.log(formData)
                const response = await axios.post('http://localhost:4000/movie/add-movie', formData)
                console.log(response)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Thêm phim thành công'
                })
                navigate('/products')
            } catch (error) {
                console.error(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response.data.message
                })
            }
        }
    }

    const [selected, setSelected] = useState([])
    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelected([...selected, id])
        } else {
            setSelected(selected.filter((selectedId) => selectedId !== id))
        }

        // Sử dụng hàm callback để in ra state selected sau khi nó được cập nhật
        setSelected((prevSelected) => {
            console.log(prevSelected)
            return prevSelected
        })
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1 className="title">Thêm Phim</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Tên Phim" name="movieName" sx={{ width: 700 }} onChange={handleChange} />
                    {errors.movieName && <p style={{ color: 'red' }}>{errors.movieName}</p>}
                    <TextField
                        label="Thể Loại Phim"
                        name="movieCategory"
                        onChange={handleChange}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                    {errors.movieCategory && <p style={{ color: 'red' }}>{errors.movieCategory}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Đạo Diễn" name="movieDirector" sx={{ width: 300 }} onChange={handleChange} />
                    {errors.movieDirector && <p style={{ color: 'red' }}>{errors.movieDirector}</p>}
                    <TextField
                        label="Diễn Viên"
                        name="movieActor"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                    {errors.movieActor && <p style={{ color: 'red' }}>{errors.movieActor}</p>}
                    <TextField
                        label="Thời Lượng Phim"
                        name="movieDuration"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                    {errors.movieDuration && <p style={{ color: 'red' }}>{errors.movieDuration}</p>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Mô Tả Phim" name="movieDescription" sx={{ width: 400 }} onChange={handleChange} />
                    {errors.movieDescription && <p style={{ color: 'red' }}>{errors.movieDescription}</p>}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Ngày ra mắt"
                                value={Movie.movieRelease}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} sx={{ width: 400 }} />}
                            />
                            {errors.movieRelease && (
                                <p style={{ color: 'red', marginTop: '15%', marginLeft: '-50%' }}>
                                    {errors.movieRelease}
                                </p>
                            )}
                        </DemoContainer>
                    </LocalizationProvider>
                    {errors.movieRelease && <p style={{ color: 'red' }}>{errors.movieRelease}</p>}
                </div>
                <div>
                    <TextField
                        label="Ngôn Ngữ/ Phụ Đề Phim"
                        name="language"
                        onChange={handleChange}
                        margin="normal"
                        sx={{ width: 400 }}
                    />
                    {errors.language && <p style={{ color: 'red' }}>{errors.language}</p>}
                    <TextField
                        label="Quốc Gia Phim"
                        name="movieCountry"
                        onChange={handleChange}
                        margin="normal"
                        sx={{ width: 300, marginLeft: '16px' }}
                    />
                    {errors.movieCountry && <p style={{ color: 'red' }}>{errors.movieCountry}</p>}
                </div>

                <FormGroup sx={{ width: 400 }}>
                    <Typography variant="h6" gutterBottom>
                        Loại phim
                    </Typography>
                    <Grid container spacing={1}>
                        {movieType.map((type) => (
                            <Grid item key={type.movieTypeId}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selected.includes(type.movieTypeId)}
                                            onChange={(event) => handleCheckboxChange(event, type.movieTypeId)}
                                        />
                                    }
                                    label={type.typeName}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </FormGroup>

                <Button variant="contained" type="file" component="label" sx={{ width: 150, marginTop: '2%' }}>
                    Upload File
                    <input type="file" name="movieImage " hidden onChange={handleImageChange}   />
                </Button>
                {fileName && (
                    <Typography variant="body1" sx={{ marginLeft: 2, marginTop: '2%' }}>
                        {fileName}
                    </Typography>
                )}


               {errors.movieImage && <p style={{ color: 'red' }}>{errors.movieImage}</p>}
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300, marginTop:"5%" }}>
                    Thêm Phim
                </Button>
            </form>
        </Box>
    )
}

export default AddProduct
