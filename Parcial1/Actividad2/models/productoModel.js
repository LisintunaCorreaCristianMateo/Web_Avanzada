//clase producto
class Producto{
    constructor(id,nombre,precio,categoria){
        this.id=id;
        this.nombre=nombre;
        this.precio=precio;
        this.categoria=categoria;
    }
}
//clas que em va a permitir administrar los productos
class ProductoModel{
    static productos = [
       new Producto(1,"Manzana",10,"Fruta"),
       new Producto(2,"Lechuga",15,"Verdura"),
       new Producto(3,"Pera",2,"Fruta"),
       new Producto(4,"Zanahoria",2.5,"Verdura"),
    ];
    //metodo para obtener todos los productos
    static obtenerTodos(){
        return this.productos;
    }
    //metodo para buscar un producto por su id
    static buscarPorId(id){
        return this.productos.find((p) => p.id === parseInt(id));
    }
    //agregar un nuevo producto
    static agregarProducto(nombre,precio,categoria){
        const nuevo = new Producto(
            this.productos.length + 1,
            nombre,
            precio,
            categoria
        );
        // agregar al array y retornar
        this.productos.push(nuevo);
        return nuevo;
    }
 static eliminarPorId(id){
        const idNumero = parseInt(id);
        const producto = this.productos.find(prod => prod.id === idNumero);
        if(!producto) return false; //no encontrado
        this.productos = this.productos.filter(prod => prod.id !== idNumero);
        return true; //eliminado   
    }

    //actualizar un producto por su id
    static actualizarPorId(id, nombre, precio, categoria){
        const idNumero = parseInt(id);
        const producto = this.productos.find(prod => prod.id === idNumero);
        
        if(!producto) return false; //no encontrado
        
        // actualizar los datos del producto
        producto.nombre = nombre;
        producto.precio = precio;
        producto.categoria = categoria;
        
        return true; //actualizado exitosamente
    }
}

//Exportar clases 
export default ProductoModel;
export {Producto};