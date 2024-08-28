const { db } = require('../database/db')

exports.changeStatusToOnline = async (id) => {
    try {
        const query = 'UPDATE users SET status=$1 WHERE user_id=$2'
        const values = ['online', id]
        await db.query(query, values)
    } catch (err) {
        console.log('failed to change status to online')
        console.log(err)
    }
}
exports.changeStatusToOffline = async (id) => {
    try {
        const query = 'UPDATE users SET status=$1 WHERE user_id=$2'
        const values = ['offline', id]
        await db.query(query, values)
    } catch (err) {
        console.log('failed to change status to offline')
        console.log(err)
    }
}