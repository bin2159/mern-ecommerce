const mongoose=require('mongoose')
const {Schema}=mongoose

const categorySchema=new Schema({
    value:{type:String,required:true,unique:true},
    label:{type:String,required:true,unique:true},
})
const virtual=categorySchema.virtual('id')
virtual.get(function(){
    return this._id
})
categorySchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transfrom:function(doc,ref){
        delete ref._id
    }
})
exports.Category=mongoose.model('Category',categorySchema)