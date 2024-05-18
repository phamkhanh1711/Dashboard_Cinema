import { Box, Grid, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

function Booking_detail() {
    const [bookingData, setBookingData] = useState(null)

    const params = useParams()
    console.log('Params:', params.bookingId)
    
    useEffect(() => {
        axios
            .get(`http://localhost:4000/booking/detailBooking/${params.bookingId}`)
            .then((response) => {
                console.log('Booking data:', response.data)
                setBookingData(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching booking data:', error)
            })
    }, [params.bookingId])

    const exportToExcel = () => {
        if (!bookingData) return

        const ticket = bookingData.detailBookingTicket[0]
        const show = ticket.Show
        const movie = show.movie
        const cinemaHall = show.CinemaHall
        const user = bookingData.detailBooking.User

        const data = [
            ['THÔNG TIN ĐẶT VÉ'],
            ['Tên Phim', movie.movieName],
            ['Rạp', cinemaHall.cinemaHallName],
            ['Ngày Chiếu', show.CreateOn],
            ['Giờ Chiếu', `${show.startTime} ~ ${show.endTime}`],
            ['Ghế', ticket.CinemaHallSeat.Seat.numberSeat],
            ['Giá', `${bookingData.detailBooking.totalPrice} VND`],
            [''],
            ['THÔNG TIN KHÁCH HÀNG'],
            ['Họ Tên', user.fullName],
            ['Email', user.email],
            ['Số Điện Thoại', user.phoneNumber],
        ]

        const worksheet = XLSX.utils.aoa_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Booking Details')

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(blob, 'booking_details.xlsx')
    }

    const renderBookingDetail = () => {
        if (!bookingData || !bookingData.detailBookingTicket || bookingData.detailBookingTicket.length === 0) {
            return <Typography variant="h6">Loading...</Typography>
        }

        return (
            <Grid container spacing={2} p={5}>
                <Grid item xs={2} sm={6}>
                    <Grid container spacing={2}>
                        <Grid>
                            <Box>
                                <Typography variant="h5" mt={6}>
                                    THÔNG TIN ĐẶT VÉ
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <img
                                    src={bookingData.detailBookingTicket[0].Show.movie.movieImage}
                                    alt="booking"
                                    style={{ width: '40%', marginTop: '4%' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10} sm={6} ml={-10}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box>
                                <Typography variant="h5" mt={6} fontWeight={'bold'}>
                                    {bookingData.detailBookingTicket[0].Show.movie.movieName}
                                </Typography>
                            </Box>
                            <hr style={{ borderTop: '1px solid black', fontWeight: 'bold' }}></hr>
                            <Box>
                                <Typography variant="h6" mt={3}>
                                    Rạp:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBookingTicket[0].Show.CinemaHall.cinemaHallName}
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Ngày Chiếu:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBookingTicket[0].Show.CreateOn}
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Giờ Chiếu:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBookingTicket[0].Show.startTime} ~{' '}
                                        {bookingData.detailBookingTicket[0].Show.endTime}
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Ghế:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBookingTicket[0].CinemaHallSeat.Seat.numberSeat}
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Giá:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBooking.totalPrice} VND
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <Typography variant="h5" mt={6} fontWeight={'bold'}>
                                    THÔNG TIN KHÁCH HÀNG
                                </Typography>
                            </Box>
                            <hr style={{ borderTop: '1px solid black', fontWeight: 'bold' }}></hr>
                            <Box>
                                <Typography variant="h6" mt={3}>
                                    Họ Tên:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBooking.User.fullName}
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Email:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBooking.User.email}
                                    </Box>{' '}
                                </Typography>
                                <Typography variant="h6" mt={3}>
                                    Số Điện Thoại:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {bookingData.detailBooking.User.phoneNumber}
                                    </Box>{' '}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={exportToExcel}>
                        In Vé
                    </Button>
                </Grid>
            </Grid>
        )
    }

    return <Box sx={{ flexGrow: 1 }}>{renderBookingDetail()}</Box>
}

export default Booking_detail
