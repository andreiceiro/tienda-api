import User from '../models/User'
import Roles from '../models/Role'


export const createUser=async(req, res)=>{
    const {username, email, password, roles}=req.body;
    const newUser = new User({
          username,
          email,
          password:  await User.cifrarPassword(password)
    })

    if (roles) {
        const foundRoles=await Roles.find({name:{$in: roles}});
        newUser.roles=foundRoles.map(role=> role._id);
    }else{
        const role= await Roles.findOne({name:"user"});
              newUser.roles=[role._id];
    }

    await newUser.save();
    let usuarios=await User.find();
        usuarios=await SustituirIdsRolesForName(usuarios);
    
        
    res.json(usuarios);
}
//-------------------Metodo auxiliares para el metodo createUser-------------------------
const getNameRoles=async(rolesUser)=>{
    const foundRoles = await Roles.find({_id:{$in: rolesUser}});
    const nameRoles = foundRoles.map(role=>role.name);
    return nameRoles;
}

const SustituirIdsRolesForName=async(usuarios)=>{
    const rolesUsers= usuarios.map(usuario=>usuario.roles);
    
    const NameRolesUsers=[]; //nombre de los roles de todos los usuarios registrados DB
    for(let i=0;i<rolesUsers.length;i++)//obtenemos el nombre de los roles de cada usuario
        {
         const NameRoles=await getNameRoles(rolesUsers[i]);   
            NameRolesUsers.push(NameRoles);
        }
    
     for (let i = 0; i < usuarios.length; i++)
          for(let j=0;j<NameRolesUsers[i].length;j++)
              usuarios[i].roles[j]=NameRolesUsers[i][j];
              //recoremos arreglo usuarios replazamos el id role por su correspondiente nombre

    return usuarios;
}
//-------------------------------------------------------------------------------------------------
export const updateUserByIdSol2= async(req, res)=>{
    const {username, email, password, roles}= req.body;
    const userId=req.params.userId;
   
    const foundRoles=await Roles.find({name:{$in: roles}});
    const listIdRoles=foundRoles.map(role=> role._id)
   
    const usuarioAct= await User.findOneAndUpdate({_id: userId}, {
        username,
        email,
        password: await User.cifrarPassword(password),
        roles: listIdRoles
        },
        {new: true});

        res.json(usuarioAct);
}

export const updateUserByIdSol1= async(req, res)=>{
     const {username, email, password, roles}= req.body;
     const userId=req.params.userId;

     const usuarioAct= await User.findById(userId);
           usuarioAct.username= username;
           usuarioAct.email= email;
           usuarioAct.password= await User.cifrarPassword(password);

           const foundRoles=await Roles.find({name:{$in: roles}});
           const listIdRoles=foundRoles.map(role=> role._id)

           usuarioAct.roles=listIdRoles;

           console.log(usuarioAct);
           usuarioAct.save()
           .then(()=> res.json(usuarioAct))
           .catch(error=>res.status(400).json({massage:"error al actualizar"}))
           
           //res.json({message:"test update Sol1"});
}

export const updateUserById=async(req, res)=>{
    const {username, email, password, roles}= req.body;
    const userId= req.params.userId;
    
         const foundRoles=await Roles.find({name:{$in: roles}});
         
         const listIdRoles=foundRoles.map(role=> role._id)
                  
         const result= await User.updateOne({_id: userId}, {
           username: username,
           email: email,
           password: await User.cifrarPassword(password),
           roles: listIdRoles});
          
          if (result.n===1 && result.nModified===1 && result.ok===1) 
             { 
               const usuarioModificado = await User.findById(userId);
               res.json(usuarioModificado);
             }
          else res.status(400).json({message:"Error in the Update"});
            
}

export const deleteUser = async(req, res)=>{
    
    const userDel = await User.findByIdAndDelete(req.params.userId);
    
    res.status(204).json(userDel);
}

export const getUsers=async(req, res)=>{
    let Users= await User.find();
        Users= await SustituirIdsRolesForName(Users);  
    res.json(Users);
}

export const getUserById=async(req, res)=>{
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    res.json(user);
}