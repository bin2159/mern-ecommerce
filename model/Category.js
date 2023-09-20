const mongoose=require('mongoose')
const {Schema}=mongoose

const categorySchema=new Schema({
    value:{type:String,required:true,unique:true},
    label:{type:String,require:true,unique:true},
})
const virtual=categorySchema.virtual('id')
virtual.get(function(){
    return this._id
})
virtual.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transfrom:function(doc,ref){
        delete ret._id
    }
})
exports.Category=mongoose.model('Category',categorySchema)