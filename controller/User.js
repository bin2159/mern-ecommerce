const { User } = require("../model/User")
const { sanitizeUser } = require("../services/common")


exports.fetchUserById=async(req,res)=>{

    try {
        const user=await User.findById(req.user.id)
        res.status(200).json({id:user.id,addresses:user.addresses,email:user.email,role:user.role})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}


exports.updateUser=async(req,res)=>{
    const {id}=req.user
    try {
        const user=await User.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:error.message})
    }
}