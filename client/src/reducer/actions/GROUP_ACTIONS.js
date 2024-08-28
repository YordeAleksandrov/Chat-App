export const GROUP_SOCKET_CONNECT = 'GROUP_SOCKET_CONNECT';
export const GROUP_SOCKET_DISCONNECT = 'GROUP_SOCKET_DISCONNECT';
export const GROUP_SOCKET_MESSAGE = 'GROUP_SOCKET_MESSAGE';
export const LOAD_INITIAL_GROUP='LOAD_INITIAL_GROUP'

export const  connectGroupSocket = (groupId,userId) => ({
    type: GROUP_SOCKET_CONNECT,
    payload:{
        groupId,
        userId
    }
});

export const disconnectGroupSocket = () => ({
    type: GROUP_SOCKET_DISCONNECT,
    payload:null
});
export const loadInitialGroup = (groupId, userId) => {
    return async (dispatch) => {
        try {
            const accessToken=sessionStorage.getItem('accessToken')
            const response = await fetch(`http://localhost:3001/group/data/${groupId}/${userId}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                  }
            });
            if(!response.ok){
                console.log(response)
                return
            }
            const data = await response.json();
            dispatch({
                type: LOAD_INITIAL_GROUP,
                payload: data
            });
        } catch (error) {
            console.log('Failed to load initial group data:', error);
        }
    };
};