// import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import '../styles/Login.css';

const Login=()=>{
    // const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    

    const handleLogin = ()=> {
        if(email.trim() ===''){
            alert ('Por favor ingrese un email valido');
            return;
        }
    }

return(
    <div className="login-container">
        <div className="login-card">
            <h1>Login</h1>
            <input 
            type="text" 
            placeholder='email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder='contraseña'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
           <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleLogin}
            >
                Ingresar
            </button>
        </div>
    </div>

);

};
export default Login;