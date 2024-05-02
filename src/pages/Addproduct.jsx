import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { handleUploadFile } from '../config/uploadImage'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material'
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
        movieCountry: '',
        movieType: ''
    });

    const handleChange = (e) => {
        const nameInput = e.target.name;
        const value = e.target.value;
        setMovie((state) => ({ ...state, [nameInput]: value }));
    };
    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        
        setMovie({ ...Movie,  movieImage: imageFile })
    }
    
    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Loại bỏ phần header của base64
            reader.onerror = (error) => reject(error);
        });
    };  
    const [movieType, setMovieType] = useState([]);

    useEffect(() => {
        getMovieType();
    }, []);

    const getMovieType = async () => {
        try {
            const response = await axios.get('http://localhost:4000/movie/movieType');
            console.log(response);
            setMovieType(response.data.allMovieType); // Đảm bảo truy cập vào response.data.allMovieType
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            if(Movie.movieImage !== '')
            {
                const urlImage = await handleUploadFile(Movie.movieImage)
                setMovie({ ...Movie, movieImage: urlImage })
            }
            const formattedDate = format(new Date(Movie.movieRelease), 'yyyy-MM-dd');
            const formData = {
                movieName: Movie.movieName,
                movieCategory: Movie.movieCategory,
                movieDescription: Movie.movieDescription,
                movieDirector: Movie.movieDirector,
                movieActor: Movie.movieActor,
                movieImage: Movie.movieImage, // Sử dụng đường dẫn của ảnh từ server
                movieDuration: parseInt(Movie.movieDuration),
                movieRelease: formattedDate,
                language: Movie.language,
                country: Movie.movieCountry,
                movieType: selected // Thêm trường movieType vào formData
            };
    
            const response = await axios.post('http://localhost:4000/movie/add-movie', formData);
            console.log(response);
            alert('Thêm phim thành công');
            navigate('/products');
        } catch (error) {
            console.error(error);
            alert('Thêm phim không thành công');
        }
    };
    
    
    const [selected, setSelected] = useState([]);
    const handleCheckboxChange = (event, id) => {
        if (event.target.checked) {
            setSelected([...selected, id]);
        } else {
            setSelected(selected.filter((selectedId) => selectedId !== id));
        }
    
        // Sử dụng hàm callback để in ra state selected sau khi nó được cập nhật
        setSelected((prevSelected) => {
            console.log(prevSelected);
            return prevSelected;
        });
    };
    

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
                <div>
                <TextField
                    label="Movie Language"
                    name="language"
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 400 }}
                />
                <TextField
                    label="Movie Country"
                    name="movieCountry"
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 300, marginLeft: '16px' }}
                />
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

                <input type="file" name="movieImage" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Add Product
                </Button>
            </form>
        </Box>
    )
}

export default AddProduct
