import { SOCKET_EVENTS } from "../Socket/socketEvents";



export const ranked =({socket, setLoading, user})=>{
    setLoading(true);
    
    socket.emit(SOCKET_EVENTS.MATCH_FIND,user?.userName);

}