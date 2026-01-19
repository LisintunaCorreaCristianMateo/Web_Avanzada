import { useState } from 'react';
import '../styles/list.css';

const ProductList = ({productos, onActualizar, onEliminar}) => {
    const [editando, setEditando] = useState(null);
    const [formEditar, setFormEditar] = useState({ title: '', price: 0 });

    const iniciarEdicion = (producto) => {
        setEditando(producto.id);
        setFormEditar({ title: producto.title, price: producto.price });
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setFormEditar({ title: '', price: 0 });
    };

    const guardarEdicion = (id) => {
        if (formEditar.title.trim() === '' || formEditar.price <= 0) {
            alert('Datos inválidos');
            return;
        }
        onActualizar(id, formEditar);
        cancelarEdicion();
    };

    return (
        <div className="listContainer">
            <h1>Lista de Productos</h1>
            {productos.length === 0 ? (
                <p className="emptyMessage">No hay productos disponibles</p>
            ) : (
                <ul className="productList"> 
                    {productos.map((p) => (
                        <li key={p.id} className="productItem"> 
                            {editando === p.id ? (
                                // Modo edición
                                <div className="editForm">
                                    <input 
                                        type="text" 
                                        value={formEditar.title}
                                        onChange={(e) => setFormEditar({...formEditar, title: e.target.value})}
                                        className="editInput editInputTitle"
                                        placeholder="Título del producto"
                                    />
                                    <input 
                                        type="number" 
                                        value={formEditar.price}
                                        onChange={(e) => setFormEditar({...formEditar, price: e.target.value})}
                                        className="editInput editInputPrice"
                                        placeholder="Precio"
                                    />
                                    <button onClick={() => guardarEdicion(p.id)} className="btn btnSave">
                                        Guardar
                                    </button>
                                    <button onClick={cancelarEdicion} className="btn btnCancel">
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                // Modo visualización
                                <div className="productContent">
                                    <span className="productInfo">
                                        <span className="productTitle">{p.title}</span>
                                        <span className="productPrice">${p.price}</span>
                                    </span>
                                    <div className="buttonGroup">
                                        <button 
                                            onClick={() => iniciarEdicion(p)} 
                                            className="btn btnEdit"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('¿Estás seguro de eliminar este producto?')) {
                                                    onEliminar(p.id);
                                                }
                                            }}
                                            className="btn btnDelete"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProductList;