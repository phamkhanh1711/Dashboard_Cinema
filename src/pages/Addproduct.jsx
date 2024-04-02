import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 }
    // Thêm các phim khác vào đây
]
const categoryFilms = [
    { title: 'Hành Động' },
    { title: 'Kịch Tính' },
    { title: 'Tâm Lý' },
    { title: 'Hài Hước' }
    // Thêm các phim khác vào đây
]
const daodienFilms = [
    { title: 'K' },
    { title: 'A' },
    { title: 'Y' },
    { title: 'Q' }
    // Thêm các phim khác vào đây
]
const dienvienFilms = [
    { title: 'Song Kang' },
    { title: 'Song Jong Ki' },
    { title: 'Bae Suzy' },
    { title: 'Bạch Lộc' }
    // Thêm các phim khác vào đây
]
const thoiluongFilms = [
    { title: '120 phút' },
    { title: '180 phút' },
    { title: '90 phút' },
    { title: '150 phút' }
    // Thêm các phim khác vào đây
]
const noidungFilms = [
    { title: 'Một cậu bé trở thành Đấng cứu thế của những người du mục' }

    // Thêm các phim khác vào đây
]
const khoichieuFilms = [
    { title: '01/03/2024' }

    // Thêm các phim khác vào đây
]
function AddProduct() {
    const [product, setProduct] = useState({
        title: '',
        category: '',
        price: '',
        image: null // Thay đổi thành null để lưu trữ ảnh
    })

    const handleAutocompleteChange = (field) => (event, value) => {
        if (value) {
            setProduct({ ...product, [field]: value.title })
        } else {
            setProduct({ ...product, [field]: '' })
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setProduct({ ...product, [name]: value })
    }

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        setProduct({ ...product, image: imageFile })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // Thực hiện logic để thêm sản phẩm vào cơ sở dữ liệu ở đây
        console.log('Submitted product:', product)
        // Reset form sau khi thêm sản phẩm thành công
        if (product.title.trim() != '') {
            alert('them thanh cong')
            setProduct({
                ...product,
                title: '',
                category: '',
                price: product.price, // Giữ nguyên giá trị của price
                image: null // Reset ảnh về null
            })
        } else {
            alert('Thêm sản phẩm thất bại. Vui lòng điền đầy đủ thông tin sản phẩm.')
        }
    }

    return (
        <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 700 }}
                        renderInput={(params) => <TextField {...params} label="Phim" />}
                        onChange={handleAutocompleteChange('title')}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={categoryFilms}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 700, marginLeft: '16px' }}
                        renderInput={(params) => <TextField {...params} label="Thể Loại" />}
                        onChange={handleAutocompleteChange('category')}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={daodienFilms}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Đạo diễn" />}
                        onChange={handleAutocompleteChange('daodien')}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={dienvienFilms}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 300, marginLeft: '16px' }}
                        renderInput={(params) => <TextField {...params} label="Diễn viên" />}
                        onChange={handleAutocompleteChange('dienvien')}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={thoiluongFilms}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 300, marginLeft: '16px' }}
                        renderInput={(params) => <TextField {...params} label="Thời Lượng" />}
                        onChange={handleAutocompleteChange('thoiluong')}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={noidungFilms}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 400 }}
                        renderInput={(params) => <TextField {...params} label="Nội Dung" />}
                        onChange={handleAutocompleteChange('noidung')}
                    />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={khoichieuFilms}
                        getOptionLabel={(option) => option.title}
                        sx={{ width: 300, marginLeft: '16px' }}
                        renderInput={(params) => <TextField {...params} label="Khởi Chiếu" />}
                        onChange={handleAutocompleteChange('khoichieu')}
                    />
                </div>
                <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ width: 300 }}
                />
                <input
                    type="file"
                    accept="image/*" // Chỉ chấp nhận các loại file ảnh
                    onChange={handleImageChange}
                    style={{ marginBottom: '16px' }}
                />
                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Add Product
                </Button>
            </form>
        </Box>
    )
}

export default AddProduct
