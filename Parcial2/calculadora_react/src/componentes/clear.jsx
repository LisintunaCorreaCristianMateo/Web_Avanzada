import '../style/clear.css';
const BotonClear=({children,manejarClick})=>{
    return(
       <div className='boton-clear-contenedor'
       onClick={()=>manejarClick(children)}
       >
       {children}

       </div>
    );
}
export default BotonClear;