import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Productos from '../pages/Productos.jsx';
import Usuarios from '../pages/Usuarios.jsx';
import Login from '../pages/Login.jsx';
import Navbar from '../components/Navbar.jsx';

const AppRouter=()=>{
    return(
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/productos' element={<Productos/>}/>
                <Route path='/usuarios' element={<Usuarios/>}/>
                <Route path='/login' element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;