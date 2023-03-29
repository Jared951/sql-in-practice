require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {
    getAllClients,
    getPendingAppointments,
    getUpcomingAppointments,
    getPastAppointments, 
    approveAppointment, 
    completeAppointment, 
    deleteAppointment
} = require('./controller.js')

app.use(express.json())
app.use(cors())

// USERS
app.get('/clients', getAllClients) //In index.js, comment line 20 back in (this line: app.get('/clients', getAllClients))

// APPOINTMENTS
app.get('/pending', getPendingAppointments) //In index.js, comment line 23 and 24 back in (these lines: app.get('/pending', getPendingAppointments), and app.get('/upcoming', getUpcomingAppointments))
app.get('/upcoming', getUpcomingAppointments)
app.get('/appt', getPastAppointments) //In index.js, comment line 25 back in (this line: app.get('/appt', getPastAppointments))
app.put('/approve', approveAppointment) //In index.js, comment line 26 back in (this line: app.put('/approve', approveAppointment))
app.put('/complete', completeAppointment) //In index.js, comment line 27 back in (this line: app.put('/complete', completeAppointment))

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))