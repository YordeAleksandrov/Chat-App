const WebSocket = require('ws');
const { deleteMessage, editMessage,addReaction,removeReaction,createGroupInvite } = require('../database/db_group_helpers');

const groupClients = new Map();

const startGroupSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', (ws, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId');
        const groupId = url.searchParams.get('groupId');
        console.log(`group socket connected`);
        groupClients.set(ws, { userId, groupId });

        ws.on('message', (message) => {
            const messageString = message.toString();
            const messageJson = JSON.parse(messageString);
            console.log(messageJson)

            switch (messageJson.type) {
                case 'Typing': {
                    const { groupId, userId, name } = JSON.parse(messageString)
                    groupClients.forEach((clientInfo, clientWs) => {
                        if (clientInfo.groupId === groupId && clientInfo.userId !== userId && clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                type: 'Typing',
                                name: name
                            }))
                        } 
                    });
                }
                    break;
                case 'stopTyping': {
                    const { groupId, userId, name } = JSON.parse(messageString)
                    groupClients.forEach((clientInfo, clientWs) => {
                        if (clientInfo.groupId === groupId && clientInfo.userId !== userId && clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                type: 'stopTyping',
                                name: name
                            }))
                        }
                    });
                }
                    break;
                case 'deleteMessage': {
                    const { groupId, id } = JSON.parse(messageString)
                    check = deleteMessage(id)
                    if (!check) return
                    groupClients.forEach((clientInfo, clientWs) => {
                        if (clientInfo.groupId === groupId && clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                type: 'deleteMessage',
                                id: id
                            }))
                        }
                    });
                }
                case 'addReaction': {
                    const { messageId, groupId, userId, username, emoji } = JSON.parse(messageString)
                     const check = addReaction(messageId, userId, username, emoji)
                    if (!check) return;
                    groupClients.forEach((clientInfo, clientWs) => {
                        if (clientInfo.groupId === groupId && clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                type: 'addReaction',
                                messageId,
                                userId,
                                username,
                                emoji
                            }))
                        }
                    });
                    break;
                }
               
                case 'removeReaction': {
                    const { messageId, groupId, userId, username, emoji } = JSON.parse(messageString);
                    const check = removeReaction(messageId, userId, username, emoji);
                    if (!check) return;
                    groupClients.forEach((clientInfo, clientWs) => {
                        if (clientInfo.groupId === groupId && clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                type: 'removeReaction',
                                messageId,
                                userId,
                                username,
                                emoji
                            }));
                        }
                    });
                    break;
                }
                case 'editMessage': {
                    const { groupId, id, content } = JSON.parse(messageString)
                    check =true 
                    // editMessage(id, content)
                    if (!check) return
                    groupClients.forEach((clientInfo, clientWs) => {
                        if (clientInfo.groupId === groupId && clientWs.readyState === WebSocket.OPEN) {
                            clientWs.send(JSON.stringify({
                                type: 'editMessage',
                                id: id,
                                content: content
                            }))

                        }
                    });
                    break;
                }


            }


        });

        ws.on('close', () => {
            console.log(`User disconnected: ${userId}`);
            groupClients.delete(ws);
        });
    });
};

const sendMessageToGroupMembers = (groupId, message) => {
    groupClients.forEach((clientInfo, clientWs) => {
        if (clientInfo.groupId === groupId && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify(message));
        }
    });
};
const updateMembersStatus = (memberId,status, groupIdArray) => {
    groupClients.forEach((clientInfo, clientWs) => {
        if (groupIdArray.includes(clientInfo.groupId)) {
            clientWs.send(JSON.stringify({
                type:'updateStatus', 
                memberId:memberId,
                status:status
            }));
        }
    });
};

module.exports = {
    startGroupSocketServer,
    sendMessageToGroupMembers,
    updateMembersStatus
}; 