import {useState} from 'react'
import '../styles/form.css'

const ProductForm=({onCrear})=>{
    const[title,setTitle]=useState('');
    const[price,setPrice]=useState('');

     const manejarSubmit=(e)=>{
        e.preventDefault();//evita recarga de pagina

        if(title.trim()==="" || price <= 0) return;
        const nuevoProducto={
            title,
            price:Number(price)
        };

        onCrear(nuevoProducto);

        // Limpiar el formulario
        setTitle('');
        setPrice('');
    }

    return (
        <div>
        <div className='formContainer'>
        
        <form onSubmit={manejarSubmit}>
            <h3 style={{textAlign:"center"}}>Crear Producto</h3>
            <div>
                <input 
                    className='imputClass'
                    type="text" 
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <input 
                    className='imputClass'
                    type="number" 
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <button className="botonForm" type="submit">Crear</button>
        </form>
        
        </div>
        </div>
    );
};

export default ProductForm;