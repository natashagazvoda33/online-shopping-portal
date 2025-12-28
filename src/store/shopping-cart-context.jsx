import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

// whenever an action is dispatched to the reducer, this function will be executed outside of the component
// it takes the latest state snapshot and an action, and lastly returns the new state
function shoppingCartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    //Esta función recibe el estado actual y una acción.
    //Si la acción es "ADD_ITEM", busca si el producto ya existe
    //en el carrito. Si existe, incrementa la cantidad en 1.
    //Si no existe, lo agrega como un nuevo artículo con cantidad 1.

    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );

    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      // copy previous state properties to not lose any data
      ...state,
      items: updatedItems,
    };
  }

  if (action.type === "UPDATE_ITEM_QUANTITY") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

// Centralize the whole state management related to the shopping cart here!!
export default function CartContextProvider({ children }) {
  // we replace the useState with useReducer to manage the shopping cart state because it gets more complex
  // useReducer toma el reductor como función y el estado inicial (un objeto con un array vacío de items).
  // Devuelve shoppingCartState (el estado actual) y dispatchShoppingCart (la función para enviar acciones).
  const [shoppingCartState, dispatchShoppingCart] = useReducer(
    shoppingCartReducer,
    {
      items: [],
    }
  );

  function handleAddItemToCart(id) {
    // for whener a product is added,
    // instead of having a complex setShoppingCart call here, we dispatch an action that's specific
    dispatchShoppingCart({
      type: "ADD_ITEM",
      payload: id,
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatchShoppingCart({
      type: "UPDATE_ITEM_QUANTITY",
      payload: {
        productId,
        amount,
      },
    });
  }

  // passing addItemToCart prop we allow any component that's wrapped by the context provider
  // to access handleAddItemToCart function
  // same with handleUpdateCartItemQuantity
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  // return the provider with the context value we defined
  // and wrap all children with it so any component wrapped by this provider
  // can access the context value
  return (
    <CartContext.Provider value={ctxValue}> {children} </CartContext.Provider>
  );
}
