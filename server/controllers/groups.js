
const { chown } = require('fs');
const { db } = require('../database/db')
const { sendMessageToGroupMembers } = require('../sockets/groupSocket')
const path = require('path');
const fileTypeMapping = {
    '.jpeg': 'image',
    '.jpg': 'image',
    '.png': 'image',
    '.gif': 'image',
    '.ico': 'image'
};
exports.joinGroup = (req, res) => {
    const { groupId, userId } = req.body
    try {
        db.query('INSERT INTO group_members (group_id,user_id)VALUES($1,$2)', [groupId, userId])
        res.status(200).send('group successfully joined')
    } catch (error) {
        res.status(500).send({ message: error })
    }

}
exports.createGroup = (async (req, res) => {
    const { id, name, description, owner_id, created_at, image_url, privacy } = req.body
    const query = 'INSERT INTO groups (id,name,description,privacy,image_url,owner_id,created_at) VALUES($1,$2,$3,$4,$5,$6,$7)'
    const values = [id, name, description, privacy, image_url, owner_id, created_at]
    try {
        await db.query(query, values)
        await db.query('INSERT INTO group_members (group_id,user_id)VALUES($1,$2)', [id, owner_id])
        res.status(200).send('group successfully created')
    } catch (error) {
        res.sendStatus(500)
        console.log('failed to create a group in the database:', error)
    } 


})
exports.getGroupsByUserId = async (req, res) => {
    const { userId } = req.params;

    const groupQuery = `
        SELECT g.id, g.name, g.description, g.privacy, g.image_url, g.owner_id, g.created_at
        FROM groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = $1
    `;
    const groupValues = [userId];

    try {
        const { rows: groups } = await db.query(groupQuery, groupValues);
        for (let group of groups) {
            const memberQuery = `
                SELECT u.user_id, u.username, u.email, u.status
                FROM users u
                JOIN group_members gm ON u.user_id = gm.user_id
                WHERE gm.group_id = $1
            `;
            const memberValues = [group.id];
            const { rows: members } = await db.query(memberQuery, memberValues);
            group.members = members;
        }

        res.status(200).json(groups);

    } catch (error) {
        res.sendStatus(500);
        console.log('Failed to get groups for user:', error);
    }
}
exports.loadPublicGroups = async (req, res) => {
 const testQuery='SELECT * from groups'
 const {rows}=await db.query(testQuery)
 rows.map(r=>console.log(r.description))
   
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Log the IP address

    const query = `
    SELECT g.*, array_agg(gm.user_id) AS member_ids
    FROM groups g
    JOIN group_members gm ON g.id = gm.group_id
    WHERE g.privacy = 'public'
    GROUP BY g.id
`;

    const { rows: publicGroups } = await db.query(query);
    res.status(200).json(publicGroups);
}


exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.status(200).send({ filePath: `/uploads/${req.file.filename}` });
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred while uploading the file.');
    }
};
exports.dataBy_UserId_Group_Id = async (req, res) => {
    const { userId, groupId } = req.params;
    console.log('fetching messages');
    try {
        // Fetch group information
        const groupInfoQuery = 'SELECT * FROM groups WHERE id = $1';
        const groupInfoResult = await db.query(groupInfoQuery, [groupId]);
        const groupInfo = groupInfoResult.rows[0];

        // Fetch group members
        const groupMembersQuery = `
        SELECT users.username, users.status, users.image_url, users.user_id as id
        FROM group_members
        JOIN users ON group_members.user_id = users.user_id
        WHERE group_members.group_id = $1
      `;
        const groupMembersResult = await db.query(groupMembersQuery, [groupId]);
        const groupMembers = groupMembersResult.rows;

        // Fetch group messages
        const groupMessagesQuery = `
        SELECT group_messages.*, users.username as sender_username, users.image_url as sender_image_url
        FROM group_messages
        JOIN users ON group_messages.sender_id = users.user_id
        WHERE group_messages.group_id = $1
        ORDER BY group_messages.created_at DESC
        LIMIT 50;
      `;
        const groupMessagesResult = await db.query(groupMessagesQuery, [groupId]);
        const groupMessages = groupMessagesResult.rows.reverse();

        // Fetch reactions for each message
        const messageIds = groupMessages.map(msg => msg.id);
        const reactionsQuery = `
          SELECT message_id, reaction
          FROM group_reactions
          WHERE message_id = ANY($1::integer[]);
        `;
        const reactionsResult = await db.query(reactionsQuery, [messageIds]);
        const reactionsMap = reactionsResult.rows.reduce((acc, row) => {
            acc[row.message_id] = row.reaction;
            return acc;
        }, {});

        // Attach reactions to messages
        const messagesWithReactions = groupMessages.map(msg => ({
            ...msg,
            reactions: reactionsMap[msg.id] || {}
        }));

        res.json({
            info: groupInfo,
            members: groupMembers,
            messages: messagesWithReactions,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.uploadMessageFiles = (req, res) => {
    let files = [];
    // Ensure req.files is an array
    if (Array.isArray(req.files)) {
        req.files.forEach((file) => {
            const ext = path.extname(file.path).toLowerCase(); // Get the file extension and convert to lowercase
            const type = fileTypeMapping[ext] || 'file'; // Default to 'unknown' if extension is not mapped

            files.push({
                path: file.path,
                type: type
            });
        });
    } else {
        console.error('req.files is not an array');
    }

    res.status(201).json(files)

}
exports.handleSendMessage = async(req, res) => {
    const { sender_image_url, sender_username, sender_id, group_id, content, files, type } = req.body;
    const filesToString = JSON.stringify(files)

    try {
        const result =await db.query(
            `INSERT INTO group_messages (sender_id, group_id, content, files) 
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [sender_id, group_id, content, filesToString]
        );
        sendMessageToGroupMembers(group_id, {
            sender_id,
            sender_image_url,
            sender_username,
            group_id,
            content,
            files,
            type,
            id:result.rows[0].id,
            created_at: new Date()
        })
        res.sendStatus(201);
    } catch (error) {
        console.error('Error inserting message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.deleteGroupInvitation = (req, res) => {
    const { invitationId } = req.body
     

    try {
        db.query(
            `DELETE FROM group_invites WHERE id=$1`,
            [invitationId]
        );
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

