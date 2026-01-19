import './App.css';
import {fetchProducts} from "./components/services/productService";
import Productlist from "./components/products/ProductList";
import Loading from "./components/products/Loading";
import { useFetch } from './components/hook/useFetch';

function App() {

const {data: products, loading, error} = useFetch(fetchProducts);

  return (
    <div className="App">
      <h1>Lista de Productos</h1>
      <p>Bienvendido a la tienda ..</p>
      {loading && <Loading/>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && <Productlist products={products}/>}

    </div>
  );
}

export default App;
