const {db}=require('./db')
const {updateMembersStatus}=require('../sockets/groupSocket')


exports.updateUserStatus = async (id, status) => {
    try {
        //UPDATE OWN STATUS IN DB
        const updateQuery = 'UPDATE users SET status = $1 WHERE user_id = $2';
        await db.query(updateQuery, [status, id]);


         //FETCH ALL THE GROUPS IDS THE USER IS IN
         const groupQuery = `
         SELECT group_id FROM group_members
         WHERE user_id = $1
     `;
     const groupValues = [id];
     let { rows:groupRows } = await db.query(groupQuery, groupValues);
     const groupIds = groupRows.map(row => row.group_id);
     if(groupIds.length>0){
        //UPDATE FOR GROUP MEMBERS
     updateMembersStatus(id,status,groupIds)
     }
    } catch (err) {
        console.error('Error updating user status:', err);
        return false;
    }
};