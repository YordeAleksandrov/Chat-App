export const USER_SOCKET_CONNECT = 'USER_SOCKET_CONNECT'
export const USER_SOCKET_DISCONNECT = 'USER_SOCKET_DISCONNECT'
export const USER_SOCKET_MESSAGE = 'USER_SOCKET_MESSAGE'
export const DELETE_GROUP_INVITATION='DELETE_GROUP_INVITATION'

//LOADER
export const toggleLoader = (data) => ({
    type: "LOADER",
    payload: data
});



//USER
export const loginUserAction = (userId) => {
    return async (dispatch) => {
        console.log('logging action triggered');
        let data = null;
        try {
            const response = await fetch("http://localhost:3001/user/getData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            data = await response.json();
            console.log(data);

            dispatch({
                type: 'LOGIN',
                payload: data
            });
            dispatch(connectUserSocket(userId))

        } catch (error) {
            console.error('Fetch error:', error);
            // Optionally, dispatch an error action
        }
    };
};
export const connectUserSocket = (userId) => {
    return {
        type: USER_SOCKET_CONNECT,
        payload: {
            userId
        }
    };
};

export const disconnectUserSocket = () => ({
    type: USER_SOCKET_DISCONNECT,
    payload: null
});
export const removeGroupInvitation=(id)=>({
    type:DELETE_GROUP_INVITATION,
    payload:id
})