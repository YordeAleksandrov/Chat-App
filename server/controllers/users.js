const { db } = require('../database/db')

exports.getUsersBySearchTerm = async (req, res) => {
    console.log('fetching user data')
    const { searchTerm, groupId } = req.body
    try {
        //get users
        const query = `
            SELECT * FROM users
            WHERE username LIKE $1
        `;
        const values = [`%${searchTerm}%`];
        const { rows } = await db.query(query, values);

       //get invited users ID's
        const invitedQuery = `
        SELECT user_id FROM group_invites
        WHERE group_id = $1
    `;
        const invitedValues = [groupId];
        const invitedResult = await db.query(invitedQuery, invitedValues);
        const invitedList = invitedResult.rows.map(row => row.user_id);
        
        res.status(200).json({ data:rows, invitedList })
    } catch (error) {
        console.log(error)
    }

}
exports.getUserData = async (req, res) => {
    const { userId } = req.body;
    let data = {}
    try {
        //FETCH USER INFO
        const userQuery = `
            SELECT * FROM users
            WHERE user_id = $1 
        `;
        const values = [userId];
        let { rows: userRows } = await db.query(userQuery, values);

        if (userRows.length > 0) {
            const user = userRows[0];

            let { rows: invitationRows } = await db.query(`
                SELECT gi.id AS invitation_id, g.name , g.image_url,g.id as group_id
                FROM group_invites gi
                JOIN groups g ON gi.group_id = g.id
                WHERE gi.user_id = $1
            `, [userId]);
            data = {
                user: {
                    ...user,
                    id: user.user_id,
                },
                groupInvitesArray: invitationRows
            };

            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUsersBySearchTerm_Friends = async (req, res) => {
    const { searchTerm, userId } = req.body;
    try {
        // Get users with name, image_url, and id
        const query = `
            SELECT user_id, username, image_url,status FROM users
            WHERE username LIKE $1 AND user_id != $2
        `;
        const values = [`%${searchTerm}%`,userId];
        const { rows } = await db.query(query, values);

        // Get invited users' IDs
        const invitedQuery = `
            SELECT receiver_id FROM friend_invites
            WHERE sender_id = $1
        `;
        const invitedValues = [userId];
        const invitedResult = await db.query(invitedQuery, invitedValues);
        const invitedList = invitedResult.rows.map(row => row.receiver_id);

        const users = rows.map(user => ({
            id: user.user_id,
            username: user.username,
            image_url: user.image_url,
            status:user.status
        }));

        res.status(200).json({ data: users, invitedList });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

