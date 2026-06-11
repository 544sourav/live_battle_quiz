//create match
// get match by id
//get match history of user by user id
// submit match result
import Match from '../models/Match.js';

export const getMatchById = async (req, res) => {
    try{
        const match = await Match.findById(req.params.id).populate('players.user', 'username').populate('questions');
        if(!match){
            return res.status(404).json(
                {
                    success:false,
                    message:"Match not found"
                }
            )
        }
        return res.status(200).json(
            {
                success:true,
                data:match
            }
        )

    }
    catch(error){
        res.status(500).json(
            {
                success:false,
                message:error.message
            }
        )
    }
}

export const MatchHistoryByUserId = async (req, res) => {
    try{
        // console.log("userid", req.userId);
        const page = req.body?.page || 1;
        const limit = req.body?.limit || 10;
        const skip = (page - 1) * limit;
        // console.log(page,limit,skip);
        
        const matches = await Match.find({
          "players.user": req.userId,
        })
          .populate({
            path: "players.user",
            select: "userName imageUrl rating",
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        return res.status(200).json(
            {
                success:true,
                data:matches
            }
        )
    }
    catch(error){
        res.status(500).json(
            {
                success:false,
                message:error.message
            }
        )
    }
}
