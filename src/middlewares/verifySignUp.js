import {ROLES} from '../models/Role';
import User from '../models/User';

export const IsRolesExisted= (req, res, next)=>{
    const {roles}= req.body;
    if(roles)
      {
       for(let i=0;i<roles.length;i++)
          {
             if(!ROLES.includes(roles[i])){
                return res.status(400).json({
                   message: `El Rol ${roles[i]} no existe`
                });
             } 
          }   
      } 
      next();
}

export const IsUserOrEmailExisted= async(req, res, next)=>{
       const user = await User.findOne({username: req.body.username}); 
       if (user) return res.status(400).json({message:'el usuario ya existe'});
       
       const email = await User.findOne({email: req.body.email}); 
       if(email) return res.status(400).json({message:'el email ya existe'});
    
       next();
}
