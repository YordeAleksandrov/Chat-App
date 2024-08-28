import { GROUP_SOCKET_MESSAGE, GROUP_MESSAGE, LOAD_INITIAL_GROUP, GROUP_SOCKET_DISCONNECT } from './actions/GROUP_ACTIONS';

const initialState = {
    info: {},
    members: [],
    messages: [],
    typing: []
};

const groupReducer = (state = initialState, action) => {
    switch (action.type) {

        case GROUP_SOCKET_MESSAGE:
            const type = action.payload.type
            switch (type) {
                case 'message':
                    return {
                        ...state,
                        messages: [...state.messages, action.payload],
                    };
                case 'editMessage': {
                    return {
                        ...state,
                        messages: state.messages.map((m) => {
                            if (m.id === action.payload.id) {
                                m.content = action.payload.content
                                return m
                            }
                            return m
                        })
                    }
                }
                case 'deleteMessage':
                    console.log('delete msg')
                    return {
                        ...state,
                        messages: state.messages.filter((m) => m.id !== action.payload.id)
                    }
                    case 'updateStatus':
                        return{
                            ...state,
                            members:state.members.map(member=>{
                                if(member.id===action.payload.memberId){
                                   member.status=action.payload.status
                                   return member 
                                }
                                return member
                            })
                        }
                case 'Typing':
                    return {
                        ...state,
                        typing: [...state.typing, action.payload.name]
                    }
                case 'stopTyping':
                    return {
                        ...state,
                        typing: state.typing.filter((name) => name !== action.payload.name)
                    }
                case 'addReaction':
                    console.log(action.payload)
                    return {
                        ...state,
                        messages: state.messages.map((msg) => {
                            if (msg.id === action.payload.messageId) {

                                if (!msg.reactions) {
                                    msg.reactions = {};
                                }

                                if (!msg.reactions[action.payload.emoji]) {
                                    msg.reactions[action.payload.emoji] = [];
                                }

                                msg.reactions[action.payload.emoji].push({
                                    userId: action.payload.userId,
                                    username: action.payload.username
                                });
                            }
                            return msg; // Return the updated message
                        })
                    };
                case 'removeReaction':
                    console.log(action.payload)
                    return { 
                        ...state,
                        messages: state.messages.map(msg => {
                            if (msg.id === action.payload.messageId) {
                                msg.reactions[action.payload.emoji]=msg.reactions[action.payload.emoji].filter(e => e.userId !== action.payload.userId)
                                return msg
                            }
                            
                            return msg 
                        })
                    }


                default:
                    return state;
            }


        case LOAD_INITIAL_GROUP:
            const { messages, members, info } = action.payload
            return {
                ...state,
                info: info,
                members: members,
                messages: messages
            }


        case GROUP_SOCKET_DISCONNECT:
            return { ...state, group: null }
        default:
            return state;
    }
};

export default groupReducer;