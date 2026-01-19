import "../../styles/app.css";

const ProductCard = ({ product }) => {
    return (
        <div className="card">
            <img src={product.image} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p className="category">{product.category}</p>
            <p className="price">${product.price.toFixed(2)}</p>
        </div>
    );
}

export default ProductCard;
