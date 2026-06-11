import { apiConnector } from "../apiConnector"
import { matchApi } from "../apis";
const { GET_MATCH_BY_USERID_API, GET_MATCH_DATA_API } = matchApi;

export const getMatch_by_userid = async(token)=>{
    try{
        const response = await apiConnector("GET", GET_MATCH_BY_USERID_API, null, {
        Authorization :`Bearer ${token}` 
        });
        // console.log("response",response)
        return response.data;
    }
    catch(error){
        console.error("Error fetching user profile:", error);
        throw error;
    }
    
}

export const getMatchData = async (token)=>{
    try{
        const res = await apiConnector("GET", GET_MATCH_DATA_API,null,{
            Authorization:`Bearer ${token}`
        });
        return res.data;

    }
    catch(error){
         console.error("Error fetching user profile:", error);
         throw error;
    }
}