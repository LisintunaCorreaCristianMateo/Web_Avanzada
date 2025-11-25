import  '../boton.css';

export const Boton=({texto,esBotonClic,manejarClic})=>{//sintaxis de desestructuracion
return(
<>


    <button
    className={esBotonClic ? "boton-clic" : "boton-reiniciar"}
    onClick={manejarClic}
    >
    
        {texto}
    </button>
</>
);
}