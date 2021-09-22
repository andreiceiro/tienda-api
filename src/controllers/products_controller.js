import Product from '../models/Product'
import User from '../models/User';
import Role from '../models/Role';
import jwt from 'jsonwebtoken';
import config from '../config';

export const createProduct =async(req, res)=>{
       
    const {name, category, price, imgURL}= req.body;
    const newProduct=new Product({
            name,
            category,
            price,
            imgURL
       });
       
       const token= req.headers['x-access-token'];
       newProduct.user=getUserId(token);

       const productDB= await newProduct.save();
       console.log(productDB);
       const p=await SustituirIdUserForName(productDB);
       console.log(p);
       res.json(p);
       
}

export const getProducts =async(req, res)=>{
    
    const token= req.headers["x-access-token"];
    const userId= getUserId(token);
    
    const usuarioAct= await User.findById(userId);
    const {roles}= usuarioAct;
    const foundRoles=await Role.find({_id:{$in: roles}});
    
    if(foundRoles.length===1)
       {
         if (foundRoles[0].name==="admin")
            {
             const products=await Product.find();
             const productoAuxs=[];
                for (let i = 0; i < products.length; i++) 
                    {
                     const producto=await SustituirIdUserForName(products[i])
                     productoAuxs.push(producto);
                    }

              res.json(productoAuxs);
            }
         else if (foundRoles[0].name==="user")
                 {
                  const products= await Product.find({user: usuarioAct._id})
                  const productoAuxs=[];
                  for (let i = 0; i < products.length; i++) 
                      {
                      const producto=await SustituirIdUserForName(products[i])
                      productoAuxs.push(producto);
                      }

                  res.json(productoAuxs); 
                 }
       }
    if(foundRoles.length===2)
       {
        if ((foundRoles[0].name==="admin" && foundRoles[1].name==="user")||
            (foundRoles[0].name==="user" && foundRoles[1].name==="admin")||
            (foundRoles[0].name==="admin" && foundRoles[1].name==="invited")||
            (foundRoles[0].name==="invited" && foundRoles[1].name==="admin"))
            {
              const products=await Product.find();
              const productoAuxs=[];
                for (let i = 0; i < products.length; i++) 
                    {
                     const producto=await SustituirIdUserForName(products[i])
                     productoAuxs.push(producto);
                    }

              res.json(productoAuxs);
            }

        if((foundRoles[0].name==="user" && foundRoles[1].name==="invited")||
           (foundRoles[0].name==="invited" && foundRoles[1].name==="user"))     
           {
            const products= await Product.find({user: usuarioAct._id})
            const productoAuxs=[];
                for (let i = 0; i < products.length; i++) 
                    {
                     const producto=await SustituirIdUserForName(products[i])
                     productoAuxs.push(producto);
                    }

            res.json(productoAuxs);
           }
                 
       }
        
}

export const getProductById =async(req, res)=>{
    const id = req.params['prodId'];
    
    const product= await Product.findById(id);
    const IdUserCreateProd= String(product.user)
    const token= req.headers["x-access-token"];
    
    const userId= getUserId(token);   

    if(IdUserCreateProd===userId)
       res.status(200).json(product);
    
    if(IdUserCreateProd!=userId){  
        const usuarioAct= await User.findById(userId);
        const {roles}= usuarioAct;
        const foundRoles=await Role.find({_id:{$in: roles}});
          
        if (foundRoles.length===1) {
              if (foundRoles[0].name==="admin")
                  res.status(200).json(product); 
              if (foundRoles[0].name==="user"){
                  res.status(400).json({message:"el usuario no tiene suficiente permisos"})
              }
              }
        if (foundRoles.length===2) {
               if ((foundRoles[0].name==="admin" && foundRoles[1].name==="user")||
                   (foundRoles[0].name==="user" && foundRoles[1].name==="admin")||
                   (foundRoles[0].name==="admin" && foundRoles[1].name==="invited")||
                   (foundRoles[0].name==="invited" && foundRoles[1].name==="admin"))
                    res.json(product);

               if((foundRoles[0].name==="user" && foundRoles[1].name==="invited")||
                  (foundRoles[0].name==="invited" && foundRoles[1].name==="user"))     
                   res.status(400).json({message:"el usuario no tiene suficiente permisos"})
              }
        }
}
//---------Metodos Auxiliares------begin-----------------------------------------------
export const getUserId= (token)=>{       
       if(!token) 
          return 0;
       
       const decode = jwt.verify(token, config.secret);
       return decode.id;

}

const SustituirIdUserForName=async(producto)=>{
      const {_id, name, category, price, imgURL, user}= producto;
      const usuario= await User.findById(producto.user);
    
      const productAux= {
            _id,
            name,
            category,
            price,
            imgURL,
            user: usuario.username
           }

   return productAux;
      
}
//----------Metodos Auxiliares------end-----------------------------------------------
export const updateProductById =async(req, res)=>{
    const id = req.params['prodId'];
    
    const product= await Product.findById(id);
    const IdUserCreateProd= String(product.user)
    const token= req.headers["x-access-token"];

    const userId= getUserId(token);

    if(IdUserCreateProd===userId)
       {
        const productAct = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        }); 
        
        const productoMod= await SustituirIdUserForName(productAct);
        
        res.status(200).json(productoMod); 
       }
    
    if(IdUserCreateProd!=userId){  
        const usuarioAct= await User.findById(userId);
        const {roles}= usuarioAct;
        const foundRoles=await Role.find({_id:{$in: roles}});
          
        if (foundRoles.length===1) {
              if (foundRoles[0].name==="admin")
                 {
                  const productAct = await Product.findByIdAndUpdate(id, req.body, {
                    new: true
                     }); 
                  
                 const productoMod= await SustituirIdUserForName(productAct);
        
                 res.status(200).json(productoMod); 
                 } 

              if (foundRoles[0].name==="user"){
                  res.status(400).json({message:"el usuario no tiene suficiente permisos"})
              }
              }
        if (foundRoles.length===2) {
               if ((foundRoles[0].name==="admin" && foundRoles[1].name==="user")||
                   (foundRoles[0].name==="user" && foundRoles[1].name==="admin")||
                   (foundRoles[0].name==="admin" && foundRoles[1].name==="invited")||
                   (foundRoles[0].name==="invited" && foundRoles[1].name==="admin"))
                   {
                    const productAct = await Product.findByIdAndUpdate(id, req.body, {
                        new: true
                    });
                    
                    const productoMod= await SustituirIdUserForName(productAct);
        
                    res.status(200).json(productoMod);
                   }

               if((foundRoles[0].name==="user" && foundRoles[1].name==="invited")||
                  (foundRoles[0].name==="invited" && foundRoles[1].name==="user"))     
                   res.status(400).json({message:"el usuario no tiene suficiente permisos"})
              }
        }

}


export const deleteProductById =async(req, res)=>{
    const id = req.params['prodId'];
    
    const product= await Product.findById(id);
    const IdUserCreateProd= String(product.user)
    const token= req.headers["x-access-token"];

    const userId= getUserId(token);

    if(IdUserCreateProd===userId)
       {
        const productDel= await Product.findByIdAndDelete(id);
        
        res.status(204).json(productDel); 
       }
    
    if(IdUserCreateProd!=userId){  
        const usuarioAct= await User.findById(userId);
        const {roles}= usuarioAct;
        const foundRoles=await Role.find({_id:{$in: roles}});
          
        if (foundRoles.length===1) {
              if (foundRoles[0].name==="admin")
                 {
                  const productDel= await Product.findByIdAndDelete(id);
                  res.status(204).json(productDel); 
                 } 

              if (foundRoles[0].name==="user"){
                  res.status(400).json({message:"el usuario no tiene suficiente permisos"})
              }
              }
        if (foundRoles.length===2) {
               if ((foundRoles[0].name==="admin" && foundRoles[1].name==="user")||
                   (foundRoles[0].name==="user" && foundRoles[1].name==="admin")||
                   (foundRoles[0].name==="admin" && foundRoles[1].name==="invited")||
                   (foundRoles[0].name==="invited" && foundRoles[1].name==="admin"))
                   {
                    const productDel= await Product.findByIdAndDelete(id);
                    res.status(204).json(productDel); 
                   }

               if((foundRoles[0].name==="user" && foundRoles[1].name==="invited")||
                  (foundRoles[0].name==="invited" && foundRoles[1].name==="user"))     
                   res.status(400).json({message:"el usuario no tiene suficiente permisos"})
              }
        }
}