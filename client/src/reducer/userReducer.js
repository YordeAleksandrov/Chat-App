import { USER_SOCKET_MESSAGE,DELETE_GROUP_INVITATION } from './actions/USER_ACTIONS'
const initialState = {
    info: {},
    friends: [],
    groupInvites: [],
    chats: [],
    notifications: []
}
export function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                info: {...action.payload.user,status:'online'},
                groupInvites: action.payload.groupInvitesArray
            }
        case 'Logout':
            return initialState
        case DELETE_GROUP_INVITATION:
            return{
                ...state,
                groupInvites:state.groupInvites.filter((invite)=>invite.id!==action.payload.id)
            }

        case USER_SOCKET_MESSAGE:
            const type = action.payload.type
            switch (type) {
                case 'groupInvite':
                    return {
                        ...state,
                        groupInvites: [...state.groupInvites, action.payload],
                    };
                default:
                    return state
            }
        default:
            return state
    }
}








