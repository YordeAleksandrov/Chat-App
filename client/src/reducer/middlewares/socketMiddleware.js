import { loadInitialGroup } from '../actions/GROUP_ACTIONS';
import {
    GROUP_SOCKET_CONNECT,
    GROUP_SOCKET_DISCONNECT,
    GROUP_SOCKET_MESSAGE,
} from '../actions/GROUP_ACTIONS';

import {
    USER_SOCKET_CONNECT,
    USER_SOCKET_DISCONNECT,
    USER_SOCKET_MESSAGE,
} from '../actions/USER_ACTIONS';

let userSocket='';
let groupSocket;

const socketMiddleware = store => next => action => {
    switch (action.type) {

        case GROUP_SOCKET_CONNECT:
            if (groupSocket) {
                groupSocket.close();
                groupSocket=''
            }
            const {groupId,userId} = action.payload;

            groupSocket = new WebSocket(`ws://localhost:8080/group?groupId=${groupId}&userId=${userId}`);
            groupSocket.onopen = () => {
                console.log('Group WebSocket connected');
                store.dispatch(loadInitialGroup(groupId, userId))
                
            };
            groupSocket.onmessage = (event) => {
                console.log(event.data)
                const message = JSON.parse(event.data);
                console.log(message)
                store.dispatch({ type: GROUP_SOCKET_MESSAGE, payload: message });
            };
           
            break;
        case GROUP_SOCKET_DISCONNECT:
            if (groupSocket) {
                groupSocket.close();
                groupSocket=''
            }
            break;

            
            //USER SOCKET
            case USER_SOCKET_CONNECT:
                console.log('entering socket user middleware')
                {
                if (userSocket) {
                    userSocket.close();
                    userSocket=''
                }
                const {userId} = action.payload;
                
                userSocket = new WebSocket(`ws://localhost:5000/?userId=${userId}`);
                userSocket.onopen = () => {
                    console.log('User WebSocket connected');
                    
                };
                userSocket.onmessage = (event) => {
                    console.log(event.data)
                    const message = JSON.parse(event.data);
                    console.log(message)
                    store.dispatch({ type: USER_SOCKET_MESSAGE, payload: message });
                };
               
                break;
                }
                
            case USER_SOCKET_DISCONNECT:
                if (userSocket) {
                    userSocket.close();
                    userSocket=''
                    store.dispatch({ type:'LOGOUT', payload:null });
                }
                break;
         
        default:
            break;
    }
    return next(action);
};
export { groupSocket,userSocket };
export default socketMiddleware;