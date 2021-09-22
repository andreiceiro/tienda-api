import { Schema, model} from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema= new Schema({
    username:{
        type: String,
        unique: true
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    roles:[{
        ref: "Role",
        type: Schema.Types.ObjectId
        //un usuario tiene muchos roles por tanto rel entre el modelo user y role es de uno a muchos
        //de tal forma que para relacionar un modelo con otro usariamos palabra reservada ref: el nombre
        //del modelo a relacionar, a continuacion definiriamos el type dato: de relacion  
    }]


},{//con la propiedad timestamps en true especificando a nuestro modelo defina la fecha de creacion 
    timestamps: true, //y la ultima fecha de actualizacion del usuario
    versionKey: false//especificamos que cada vez que creemos un doc no aparesca el --v 

})

UserSchema.statics.cifrarPassword= async(password)=>{
     const salt =await bcrypt.genSalt(10);
     return await bcrypt.hash(password, salt);
}
UserSchema.statics.compararPassword=async(password, newPassword)=>{
    return await bcrypt.compare(password, newPassword);
}
//los metodos statics nos van a permitir usar un metodo sin necesidad de instanciar un objeto para usar este 

export default model('User', UserSchema);
