import { Schema, model } from "mongoose";

const ProductSchema= new Schema({
    name: String,
    category: String,
    price: Number,
    imgURL: String,

    user:{
        ref: "User",
        type: Schema.Types.ObjectId
    }
},
{//con la propiedad timestamps en true especificando a nuestro modelo defina la fecha de creacion 
    timestamps: true, //y la ultima fecha de actualizacion del producto
    versionKey: false//especificamos que cada vez que creemos un doc no aparesca el --v 

})

export default model('Product', ProductSchema );