require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

let nextEmp = 5

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
        // In the approveAppointment function, delete *****YOUR CODE HERE**** 
        // and replace it with a query that updates the appointments table. 
        // It should set approved to equal true where the appt_id matches the one coming from the req.body, 
        // which has been destructured for you as apptId.
        // update set and where were added not the insert and values
        sequelize.query(`
        UPDATE cc_appointments
        SET approved = true 
        WHERE appt_id = ${apptId} 

        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    // In controller.js’s export object, 
    // write a new function called getAllClients (make sure it accepts req & res)
    getAllClients: (req, res) => {
        // Using sequelize.query query your database for all the columns in both cc_users and cc_clients 
        // joining them where the user_id column matches
        sequelize.query(`
        SELECT * FROM cc_clients AS c
        JOIN cc_users AS u
        ON c.user_id = u.user_id;
        `)
        // Handle the promise with .then() passing in a callback: 
        // dbRes => res.status(200).send(dbRes[0]) (you can also add a .catch) (the .then goes right after the")"
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    },

    // In controller.js, write a new function called getPendingAppointments
    getPendingAppointments: (req, res) => {
    // Using sequelize.query query your database for all appointments that are not approved (approved = false) 
    // and order them by date with the most recent dates at the top.
        sequelize.query(`
        SELECT * FROM cc_appointments
        WHERE approved = false
        ORDER by date DESC;
    `)
    // Handle the promise with .then() 
    // passing in a callback: dbRes => res.status(200).send(dbRes[0]) (you can also add a .catch)
    .then(dbRes => res.status(200).send(dbRes[0]))
    .catch(theseHands => console.log(theseHands))
    },

    // In controller.js, write a new function called getPastAppointments
    getPastAppointments: (req, res) => {
        // Using sequelize.query query your database for the following columns from their respective tables 
        // cc_appointments: appt_id, date, service_type, 
        // notes. cc_users: first_name, last_name. 
        // Reference the getUpcomingAppointments function to see how to join all the information together (you’ll need all the same tables again). 
        // Make sure to select only rows where both the approved and completed values are true. 
        // And order the results by date with the most recent at the top.
        sequelize.query(`
        SELECT a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        FROM cc_appointments a
        JOIN cc_emp_appts ea on a.appt_id = ea.appt_id
        JOIN cc_employees e on e.emp_id = ea.emp_id
        JOIN cc_users u on e.user_id = u.user_id
        WHERE a.approved = true and a.completed = true
        ORDER by a.date DESC;
        `) 
        // Handle the promise with .then() passing in a callback: 
        // dbRes => res.status(200).send(dbRes[0]) (you can also add a .catch)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    },

    //In controller.js, write a new function called completeAppointment
    completeAppointment: (req, res) => {
        let {apptId} = req.body //THIS IS IT DESTRUCTURED FROM LINE 111
        //Using sequelize.query query your database to update the appointments table. 
        //It should set completed to equal true where the appt_id matches the one coming from the req.body. 
        //(You can destructure apptId like in the previous step or use req.body.apptId.)
        sequelize.query(`
        UPDATE cc_appointments
        SET completed = true 
        WHERE appt_id = ${apptId}
        `)
        //Handle the promise with .then() passing in a callback: 
        // dbRes => res.status(200).send(dbRes[0]) (you can also add a .catch)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(theseHands => console.log(theseHands))
    }
}
