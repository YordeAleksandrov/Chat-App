const WebSocket = require('ws');
const { updateUserStatus } = require('../database/db_user_helpers')
const { createGroupInvite } = require('../database/db_group_helpers')
const { acceptGroupInvite } = require('../database/db_group_helpers')
const {addMemberToGroup}=require('../sockets/groupSocket')

const StartUserSocketServer = () => {
    const wss2 = new WebSocket.Server({ port: 5000 });
    const connectedUsers = new Map()
    wss2.on('connection', (ws, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId');
        connectedUsers.set(ws, userId);
        updateUserStatus(userId, 'online')
        console.log('User Socket Started')

        ws.on('message', (message) => {
            const messageString = message.toString();
            const messageJson = JSON.parse(messageString);


            switch (messageJson.type) {
                case 'groupInvite': {
                    (async () => {
                        const { groupId, userId } = JSON.parse(messageString)
                        const groupInvitation = await createGroupInvite(groupId, userId)
                        if (!groupInvitation) return;
                        connectedUsers.forEach((id, socket) => {
                            if (id === userId) {
                                socket.send(JSON.stringify({
                                    type: 'groupInvite',
                                    invitation_id: groupInvitation.invitationId,
                                    name: groupInvitation.group.name,
                                    image_url: groupInvitation.group.image_url,
                                    group_id: groupInvitation.group.id
                                }));
                            }
                        });
                    })()
                    break;
                }
                case 'acceptInvite': { 
                    const { groupId, member, invitationId } = JSON.parse(messageString)
                   const check= acceptGroupInvite(invitationId, groupId, member.id,member.username)
                   if(check){
                    addMemberToGroup(member,groupId)
                   }
                }
                    break;
            }
        });

        ws.on('close', () => {
            console.log(`User disconnected: ${userId}`);
            updateUserStatus(userId, 'offline')
            connectedUsers.delete(ws);
        });
    });
};
module.exports = {
    StartUserSocketServer,

}; 
