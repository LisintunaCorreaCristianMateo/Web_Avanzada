import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
    return (
        <div className="product-list">
            {products.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}
export default ProductList;