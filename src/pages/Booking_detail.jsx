import { Box, Grid, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { CircularProgress } from '@mui/material'

function Booking_detail() {
    const [bookingData, setBookingData] = useState(null)
    const [detailBookingTicket, setDetailBookingTicket] = useState(null)
    const [foodBooking, setFoodBooking] = useState(null)
    const params = useParams()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        // Set a timeout to change the loading state after 2 seconds
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000) // 2 seconds delay

        // Clear the timeout if the component is unmounted
        return () => clearTimeout(timer)
    }, [])
    useEffect(() => {
        axios
            .get(`http://localhost:4000/booking/detailBooking/${params.bookingId}`)
            .then((response) => {
                console.log('Booking data:', response.data)
                setBookingData(response.data.data)

                const ticket = response.data.data.detailBookingTicket

                setDetailBookingTicket(ticket)

                const food = response.data.data.detailBookingFood
                setFoodBooking(food)
            })
            .catch((error) => {
                console.error('Error fetching booking data:', error)
            })
    }, [params.bookingId])

    const exportToExcel = () => {
        if (!bookingData) return

        const ticket = bookingData.detailBookingTicket
        const show = ticket[0].Show
        const movie = show.movie
        const food = bookingData.detailBookingFood
        const cinemaHall = show.CinemaHall
        const user = bookingData.detailBooking.User

        // Calculate total ticket price
        const totalTicketPrice = ticket.reduce((total, item) => total + item.ticketPrice, 0)

        // Calculate total food price
        const totalFoodPrice = food.reduce((total, item) => total + item.priceFood, 0)

        // Assume you have other variables like discount, original price, and price after discount
        const discount = bookingData.prommoPrice
        const originalPrice = totalTicketPrice + totalFoodPrice

        // Create data array for Excel
        const data = [
            ['THÔNG TIN ĐẶT VÉ'],
            ['Tên Phim', movie.movieName],
            ['Rạp', cinemaHall.cinemaHallName],
            ['Ngày Chiếu', show.CreateOn],
            ['Giờ Chiếu', `${show.startTime} ~ ${show.endTime}`],
            ['Ghế', ticket.map((item) => item.CinemaHallSeat.Seat.numberSeat).join(', ')],
            [''],
            ['Đồ Ăn', food.map((item) => `${item.quantity} x ${item.Food.foodName}`).join(', ')],

            ['', ''],
            ['Tổng Giá Ghế', `${totalTicketPrice} VND`],
            ['Tổng Giá Đồ Ăn', `${totalFoodPrice} VND`],
            ['Giá Ban Đầu', `${originalPrice} VND`],
            ['Giảm giá', `- ${discount} VND`],
            ['Giá Sau Giảm Giá', `${bookingData.detailBooking.totalPrice} VND`],
            [''],
            ['THÔNG TIN KHÁCH HÀNG'],
            ['Họ Tên', user.fullName],
            ['Email', user.email],
            ['Số Điện Thoại', user.phoneNumber]
        ]
        console.log('data', data)
        const worksheet = XLSX.utils.aoa_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Booking Details')

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(blob, 'booking_details.xlsx')
    }

    const renderBookingDetail = () => {
        // tính tổng tất cả các ghế

        if (!bookingData || !bookingData.detailBookingTicket || bookingData.detailBookingTicket.length === 0) {
            return <Typography variant="h6">Loading...</Typography>
        }

        const ticketPrices = detailBookingTicket.map((ticket) => ticket.ticketPrice)

        // Calculating the total ticket price by summing up all ticket prices
        const totalTicketPrice = ticketPrices.reduce((total, price) => total + price, 0)

        const foodPrices = foodBooking.map((food) => food.priceFood)

        const totalFoodPrice = foodPrices.reduce((total, price) => total + price, 0)

        const totalSum = totalTicketPrice + totalFoodPrice
        console.log('totalSum', totalSum)
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
                                    style={{ width: '80%', marginTop: '4%' }}
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
                                    {bookingData.detailBookingTicket.map((ticket, index) => (
                                        <Box key={index} component="span" style={{ marginLeft: '7%' }}>
                                            {ticket.CinemaHallSeat.Seat.numberSeat}
                                            {index < bookingData.detailBookingTicket.length - 1 && ', '}
                                        </Box>
                                    ))}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Đồ Ăn:
                                    {bookingData.detailBookingFood.map((food, index) => (
                                        <Box key={index} ml={index === 0 ? 10 : 10} mt={-6.8} p={3}>
                                            {food.quantity} x {food.Food.foodName}
                                        </Box>
                                    ))}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Tổng Giá Ghế:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {totalTicketPrice} VND
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Tổng Giá Thức Ăn:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {totalFoodPrice} VND
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Giá (Ban Đầu):{' '}
                                    <Box ml={40} mt={-3.5}>
                                        {totalSum} VND
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Giảm Giá:{' '}
                                    <Box ml={40} mt={-3.5}>
                                        - {bookingData.prommoPrice} VND
                                    </Box>{' '}
                                </Typography>
                                <hr style={{ borderTop: '1px solid grey' }}></hr>
                                <Typography variant="h6" mt={3}>
                                    Giá (Sau Khi Giảm):{' '}
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

    return (
        <>
        {loading ? (
                <CircularProgress className="loading" />
            ) : (
        <Box sx={{ flexGrow: 1 }}>{renderBookingDetail()}</Box>
    )}
        </>
        
    )
}

export default Booking_detail
