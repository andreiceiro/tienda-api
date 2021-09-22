import express from 'express'
import morgan from 'morgan'
import pkg from '../package.json'
import productsRoutes from './routes/products_routes'
import './database'
import authRouters from './routes/auth_routes'
import userRouters from './routes/user_ruotes'
import {createRoles} from './libs/initDefaultRoles'
import cors from 'cors'

const app = express();
const corsOptions={
    origin:'http://localhost:3000'
}
createRoles();

app.set('pkg', pkg);//el metodo set de express nos va permitir darle un nombre a una variable y un valor 

app.use(morgan('dev'));

app.use(express.json());

app.get('/', (req, res)=>{
    res.json({
        name: app.get('pkg').name,
        author:app.get('pkg').author,
        description:app.get('pkg').description,
        version:app.get('pkg').version
    });
})

app.use('/api/products', cors(corsOptions),productsRoutes); //todas las rutas definidas productsRoutes 
//tener como preficjo de ruta /api/products de forma analoga el caso de abajo
app.use('/api/auth', cors(corsOptions), authRouters);
app.use('/api/users', cors(corsOptions) , userRouters);
export default app;