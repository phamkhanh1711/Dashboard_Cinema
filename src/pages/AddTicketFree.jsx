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
    });

    const handleChange = (e) => {
        const nameInput = e.target.name;
        const value = e.target.value;
        setTicket((state) => ({ ...state, [nameInput]: value }));
    };
   
    
    const handleImageChange = (event) => {
        const imageFile = event.target.files[0]
        
        setTicket({ ...ticket,  imagePromo: imageFile })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let urlImage 
        try {
            if(ticket.imagePromo !== '')
                {
                     urlImage = await handleUploadFile(ticket.imagePromo)
                     setTicket({ ...ticket, imagePromo: urlImage })
                }
        

            if (ticket.startDate >= ticket.endDate) {
                alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                return;
            }

        
            const formData = {
                code: ticket.code,
                promotionName: ticket.promotionName,
                description: ticket.description,
                discount: ticket.discount,
                startDate: ticket.startDate,
                endDate: ticket.endDate,
                imagePromo: urlImage
            };
    
            const response = await axios.post('http://localhost:4000/promotion/ticketfree', formData);
            console.log(response);
            alert('tạo vé khuyến mãi thành công');
        } catch (error) {
            console.error(error);
            alert('tạo vé khuyến mãi thất bại');
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
            <h1>Tạo Vé Khuyến Mãi</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField label="Mã" name="code" sx={{ width: 700 }} onChange={handleChange} />
                    <TextField
                        label="Tên Vé Khuyen Mai"
                        name="promotionName"
                        onChange={handleChange}
                        sx={{ width: 700, marginLeft: '16px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                    <TextField
                        label="Giới thiệu"
                        name="description"
                        sx={{ width: 300 }}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Giảm giá"
                        name="discount"
                        sx={{ width: 300, marginLeft: '16px' }}
                        onChange={handleChange}
                    />
                  
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                <TextField
                        label="Ngày Bắt Đầu"
                        name="startDate"
                        sx={{ width: 300 }}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Ngày Kết Thúc"
                        name="endDate"
                        sx={{ width: 300 , marginLeft: '16px'}}
                        onChange={handleChange}
                    />
                   
                </div>
             
                <input type="file" name="foodImage" onChange={handleImageChange} style={{ marginBottom: '16px' }} />


                <Button onClick={handleSubmit} variant="contained" type="submit" sx={{ width: 300 }}>
                    Tạo Vé Khuyến Mãi
                </Button>
            </form>
        </Box>
    )
}

export default AddTicketFree;
