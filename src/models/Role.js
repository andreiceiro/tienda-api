import { Schema, model } from "mongoose";

export const ROLES=["admin","invited","user"];
//definimos un arreglo con los roles a priori por defecto creados en db. Entonces en base a estos voy
//a validar que los roles del req pertenecen al arreglo de ROLES con esto evitamos hacer consulta db
//Recomendamos implementar como 2 da solucion consultar los roles en la db y hacer esta verificacion

const RoleSchema= new Schema({
    name: String,

},{//con la propiedad timestamps en true especificando a nuestro modelo defina la fecha de creacion 
    timestamps: true, //y la ultima fecha de actualizacion del rol
    versionKey: false//especificamos que cada vez que creemos un doc no aparesca el --v 

})

export default model('Role', RoleSchema );