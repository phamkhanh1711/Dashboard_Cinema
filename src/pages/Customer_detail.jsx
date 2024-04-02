import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

function Customer_detail() {
    let params = useParams()
    const [customerData, setCustomerData] = useState([])

    useEffect(() => {
        axios
            .get(`http://localhost:4000/user/${params.id}`)
            .then((response) => {
                console.log(response)
                if (Array.isArray(response.data.data)) {
                    setCustomerData(response.data.data)
                } else if (typeof response.data.data === 'object') {
                    // If the response data is an object, convert it to an array with one element
                    setCustomerData([response.data.data])
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [params.id])

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid container spacing={2} sx={{ maxWidth: 800 }}>
                {/* Avatar */}
                <Grid item xs={6}>
                    <Stack direction="row" spacing={2}>
                        {customerData.map((customer) => (
                            <div key={customer.id}>
                                <Avatar
                                    alt={customer.first_name}
                                    src={customer.avatar}
                                    sx={{ width: 100, height: 100 }} // Thay đổi kích thước của Avatar
                                />
                            </div>
                        ))}
                    </Stack>
                </Grid>
                {/* User Info */}
                <Grid item xs={6}>
                    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
                        <h3>Thông tin người dùng</h3>
                        <form style={{ display: 'flex', flexDirection: 'column' }}>
                            {customerData.map((customer) => (
                                <div key={customer.id}>
                                    <TextField
                                        fullWidth
                                        label="userId"
                                        name="userId"
                                        type="userId"
                                        margin="normal"
                                        value={customer.userId} // Hiển thị giá trị từ customerData
                                    />
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        margin="normal"
                                        value={customer.fullName} // Hiển thị giá trị từ customerData
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        margin="normal"
                                        value={customer.email} // Hiển thị giá trị từ customerData
                                    />
                                    <TextField
                                        fullWidth
                                        label="phoneNumber"
                                        name="phoneNumber"
                                        type="phoneNumber"
                                        margin="normal"
                                        value={customer.phoneNumber} // Hiển thị giá trị từ customerData
                                    />

                                    <Button variant="contained" sx={{ mr: 2 }}>
                                        Update
                                    </Button>
                                    <Button variant="contained" color="error">
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Customer_detail
