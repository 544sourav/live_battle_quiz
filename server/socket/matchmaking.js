import { addToWaitingList, removeFromWaitingList } from "../service/matchmaking.service.js";


const MatchmakingHandler = (io, socket) => {

    socket.on("match:find", async(userName)=>{
        // console.log("Matchmaking request received from user ID:", socket.userId);
        try{
            // console.log("socket", socket);
            await addToWaitingList({
              io,
              socket,
              userId: socket.userId,
              userName,
            });
        }
        catch(err){
            console.error("Error finding match: ", err);
            socket.emit("match:error", {message: "An error occurred while finding a match."});
        }
    })

    socket.on("match:cancel", async()=>{
        try{
            await removeFromWaitingList({userId: socket.userId});
        }
        catch(err){
            console.error("Error canceling match search: ", err);
            socket.emit("match:error", {message: "An error occurred while canceling match search."});
        }
    })

}
export default MatchmakingHandler;
