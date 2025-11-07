import React from "react";
import '../Style/testimonio.css';

export const Testimonio=(props)=>{
    return(
        < div className="contenedor-testimonio">

        <img 
        className="imagen-testimonio"
         src={require(`../imagenes/imagen${props.imagen}.png`)} 
         alt="Foto de Emma"/>
        
        <div className="contenedor-texto-testimonio">
            <strong className="nombre">{props.nombre} en {props.pais}</strong>
            <p className="cargo">Ingeniera de Software en <strong>{props.empresa}</strong> </p>
            <p className="texto">
                 "{props.testimonio}"
            </p>
        </div>
        
        </div>
    );
}