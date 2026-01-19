import './App.css';
import { fetchProducts } from "./components/services/productService";
import ProductList from "./components/products/ProductList";
import Loading from "./components/products/Loading";
import { useFetch } from './components/hook/useFetch';

function App() {
  const { data: products, loading, error } = useFetch(fetchProducts);

  return (
    <div className="App">
      <h1> Tienda Online</h1>
      <br></br>
      <p>Bienvenido a nuestra tienda</p>
   
      <hr></hr>
        <br></br>
          <br></br>
            <br></br>

      {loading && <Loading />}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && <ProductList products={products} />}
    </div>
  );
}

export default App;
