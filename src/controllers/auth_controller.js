import User from "../models/User";
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from '../models/Role'

export const singUP= async(req, res)=>{
    const {username, email, password, roles}=req.body;
    const newUser = new User({
          username,
          email,
          password:  await User.cifrarPassword(password)
    })
     
    let rolesName=[];

    if (roles) {
        if(roles.length>0)
          {
           const foundRoles=await Role.find({name:{$in: roles}});
           newUser.roles=foundRoles.map(role=> role._id);
           rolesName=foundRoles.map(role=> role.name);
          }
        if(roles.length==0)  
          {//rol por defecto
            const role= await Role.findOne({name:"user"});
            newUser.roles=[role._id];
            rolesName.push(role.name);  
          }
    }
    else{
        const role= await Role.findOne({name:"user"});
              newUser.roles=[role._id];
              rolesName.push(role.name);
        }

    const savedUser = await newUser.save();
    
    console.log(savedUser);

    
    console.log(rolesName)

    const token=jwt.sign({id: savedUser._id}, config.secret, {
        expiresIn: "1d" 
    });
    
    res.json({token, rolesName});
}

export const singIN= async(req, res)=>{
      //la funcion populate nos permite poblar la propiedad de un objeto, en nuestro caso poblariamos 
      //propiedad roles de el modelo User, este metodo nos daria todos los objetos del modelo Role cuyo
      //arreglo de _id esta especificado en la propiedad  roles del modelo User. 
     const userFound=await User.findOne({email:req.body.email}).populate("roles");
     
     if(!userFound)
        return res.status(400).json({token:null, message:"Usuario no existe"});
    
        const passwordOk = await User.compararPassword(req.body.password, userFound.password);

     if(!passwordOk) return res.status(401).json({token:null, message:"contraseña incorrecta"});

     const token=jwt.sign({id: userFound._id}, config.secret, {
        expiresIn: "1d" 
    });
    
    const rolesNameUserFound=userFound.roles.map(role=>role.name)
      res.status(200).json({token, rolesNameUserFound});
}

