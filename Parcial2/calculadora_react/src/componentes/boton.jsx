import '../style/botones.css';
const Boton=({children,agregarInput,manejarClick})=>{

const esOperador=valor=>{
    return isNaN(valor) && (valor !== '.') && (valor !== '=');
};

return(
    <div
    
    className={`boton-contenedor${esOperador(children)?'Operador':''}`}
    onClick={()=>manejarClick(children)}
    >

    {children}
    
    </div>

);
}
export default Boton;