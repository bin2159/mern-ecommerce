const mongoose=require('mongoose')
const {Schema}=mongoose

const brandSchema=new Schema({
    label:{type:String,required:true,unique:true},
    value:{type:String,required:true,unique:true}
})

const virtual=brandSchema.virtual('id')
virtual.get(function(){
    return this._id
})
virtual.set('toJSON',{
    virtual:true,
    versionKey:false,
    transform:function(doc,ref){
        delete ref._id
    }
})

exports.Brand= mongoose.model('Brand',brandSchema)