const {db}=require('./db')


exports.deleteMessage = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM group_messages WHERE id = $1';
        await db.query(deleteQuery, [id]);
        return true;
    } catch (err) {
        console.error('Error deleting message:', err);
        return false;
    }
};
exports.editMessage=async(id,content)=>{
    try {
        const updateQuery = 'UPDATE group_messages SET content = $1 WHERE id = $2';
        await db.query(updateQuery, [content, id]);
        return true
    } catch (err) {
      return false
    }
}
exports.addReaction = async (messageId,userId,username,emoji) => {
    try {
        const selectQuery = 'SELECT * FROM group_reactions WHERE message_id = $1';
        const { rows } = await db.query(selectQuery, [messageId]);
        let reactions = rows.length > 0 ? (rows[0].reaction) : {};
        if (!reactions[emoji]) {
            reactions[emoji] = [];
        }
        reactions[emoji].push({userId,username})

        

        
        const updatedReactions = JSON.stringify(reactions);
        console.log(updatedReactions)
        if(rows.length>0){
            console.log(rows[0].reaction)
        await db.query('UPDATE group_reactions SET reaction=$1 WHERE message_id=$2',
            [updatedReactions,messageId]
        )
    }else{
        
        db.query(`INSERT INTO group_reactions (message_id,reaction)
            VALUES($1,$2)`,[messageId,updatedReactions]
            
            
        )
    }
        return true
    } catch (error) {

        console.log(error)
        return false
    }
   
}
exports.removeReaction=async(messageId,userId,username,emoji)=>{
    try {
    const selectQuery = `SELECT reaction FROM group_reactions WHERE message_id = $1`;
    db.query(selectQuery, [messageId], (err, result) => {
        if (err) {
            console.error('Error retrieving reactions:', err);
            return false;
        }

        if (result.length === 0) {
            console.log('No reactions found for the given message ID');
            return false;
        }
        let reactions = result.rows[0].reaction;   
        reactions[emoji]=reactions[emoji].filter(reaction => reaction.userId !== userId)

        const updateQuery = `UPDATE group_reactions SET reaction = $1 WHERE message_id = $2`;
        db.query(updateQuery, [JSON.stringify(reactions), messageId], (updateErr, updateResult) => {
            if (updateErr) {
                return false
            } else {
               return true
            }
        });
    });

    } catch (error) {
        console.log(error)
        return false
    }
}
exports.createGroupInvite=async(groupId,userId)=>{
    const check=await db.query(`SELECT * FROM group_invites 
        WHERE group_id=$1 AND user_id=$2`,[groupId,userId])
        if(check.rows[0]){
            console.log('invitation already exists return')
            return null
        }
    const invitationQuery = `
    INSERT INTO group_invites (group_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
`;
const invitationValues = [groupId, userId];
const groupQuery = `
    SELECT *
    FROM groups
    WHERE id = $1;
    `;
    const groupValues = [groupId];

try {
    const {rows:invitation} = await db.query(invitationQuery, invitationValues);
    const {rows:group}= await db.query(groupQuery,groupValues)

    return {
        invitationId:invitation[0].id,
        group:group[0]
    }

} catch (err) {
   console.log(err)
}
};
