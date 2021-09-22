import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/User'
import Role from '../models/Role'

export const verifyToken = async(req, res, next)=>{
       try {
              const token= req.headers["x-access-token"];
              console.log(token);
       
              if(!token) return res.status(403).json({message: "No has provisto el token"});
              
              const decode = jwt.verify(token, config.secret);
              req.userId=decode.id;//guardamos variable req.userId el id del usuario cuyo token hemos 
              //verificado de esta forma todos los demas metodos tendrian acceso al valor de este parametro
              const user = await User.findById(decode.id, {password: 0});
              if(!user) return res.status(404).json({massage:'usuario no encontrado'});
              
              next();
              
       } catch (error) {
               res.status(401).json({message:'No autorizado'});
       }
       
       
}

export const IsAdmin = async(req, res, next)=>{
       const currentUser= await User.findById(req.userId);
      const roles=await Role.find({_id:{$in:currentUser.roles}});
      //buscar todos Roles cuyo id esten incluidos dentro los roles del usuario actual
      for(let i=0 ;i< roles.length; i++){
             if(roles[i].name==="admin")
               { next();
                 return; 
               }      
      }
      return res.status(403).json({message:"Se requiere el rol de admin"})

}

export const IsAdminOrUser = async(req, res, next)=>{
  const currentUser= await User.findById(req.userId);
  const roles=await Role.find({_id:{$in:currentUser.roles}});
  //buscar todos Roles cuyo id esten incluidos dentro los roles del asuario actual
  for(let i=0 ;i< roles.length; i++){
         if(roles[i].name==="admin" || roles[i].name==="user")
           { next();
             return; 
           }      
  }
  return res.status(403).json({message:"Se requiere el rol de Admin o User"}) 
  
}


export const IsInvited = async(req, res, next)=>{
      const currentUser= await User.findById(req.userId);
      const roles=await Role.find({_id:{$in:currentUser.roles}});
      //buscar todos Roles cuyo id esten incluidos dentro los roles del asuario actual
      for(let i=0 ;i< roles.length; i++){
             if(roles[i].name==="invited")
               { next();
                 return; 
               }      
      }
      return res.status(403).json({message:"Se requiere el rol de invitado"}) 
      
}
export const IsUser = async(req, res, next)=>{
       const currentUser= await User.findById(req.userId);
       const roles=await Role.find({_id:{$in:currentUser.roles}});
      //buscar todos Roles cuyo id esten incluidos dentro los roles del asuario actual
      for(let i=0 ;i< roles.length; i++){
             if(roles[i].name==="user")
               { next();
                 return; 
               }      
      }
      return res.status(403).json({message:"Se requiere el rol de usuario"})

}

