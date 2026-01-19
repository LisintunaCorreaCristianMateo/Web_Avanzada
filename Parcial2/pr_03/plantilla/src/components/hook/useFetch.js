// Imprementamos el hook useFetch para realizar peticiones HTTP y manejar el estado de carga y errores.
// Es importante tener el hook aparte para reutilizarlo en diferentes componentes.

import { useState, useEffect } from "react";// useState para manejar estados, useEffect para efectos secundarios

// Hook personalizado para realizar fetch de datos
export function useFetch(asyncFunction){//funcion asíncrona que se pasa como parámetro
    // Estados internos del hook
    const [data, setData] = useState([]);
    const [loading, setLoading]= useState(true);
    const [error, setError] = useState(null);

    //permite ejecutar una peticion cuando el componente se ejecuta
    useEffect(() => {
        // Función para cargar los datos
        async function fetchData(){
            try{
                const result = await asyncFunction();//ejecuta la funcion del api 
                setData(result);

            }catch (err){// si la api falla, se captura el error
                setError(err.message);
            }finally{// Se carga o no los datos, se desactiva el estado de carga
                setLoading(false);
            }
        }

        fetchData();
    }, [asyncFunction]); // Dependencia: se ejecuta cuando asyncFunction cambia
    
    return { data, loading, error };
}