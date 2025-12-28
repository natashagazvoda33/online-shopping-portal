import { useState } from "react";
import Header from "./components/Header.jsx";
import Shop from "./components/Shop.jsx";
import { DUMMY_PRODUCTS } from "./dummy-products.js";
import Product from "./components/Product.jsx";
import CartContextProvider from "./store/shopping-cart-context.jsx";

function App() {
  return (
    <>
      <CartContextProvider>
        <Header />
        <Shop>
          <ul id="products">
            {DUMMY_PRODUCTS.map((product) => (
              <li key={product.id}>
                <Product
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                  description={product.description}
                />
              </li>
            ))}
          </ul>
        </Shop>
      </CartContextProvider>
    </>
  );
}

export default App;
