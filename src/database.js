import mongoose from "mongoose";

mongoose.connect("mongodb://localhost/companydb",
{ useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then( db => console.log('Base de Datos conectada'))
.catch(e => console.log("error:"+ e +"Conexion fallida"))