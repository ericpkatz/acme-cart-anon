const storage = window.localStorage;
const key = 'cart';
import _ from 'lodash';

const loadOrdersFromLocal = ()=> {
  return Promise.resolve([ getLocalCart() ]);
}

const addToLocalCart = (cart, product, quantity, lineItem)=> {
  const _cart = _.cloneDeep(cart);
  if(lineItem){
    const _lineItem = _cart.lineItems.find( li => li.productId === lineItem.productId );
    _lineItem.quantity += quantity;
  }
  else {
    _cart.lineItems.push({ productId: product.id, quantity });
  }
  setLocalCart(_cart);
  return Promise.resolve();
}

const consolidatedCart = (serverCart)=> {
  const localCart = getLocalCart();
  setLocalCart(null);
  return localCart.lineItems.map( li => {
    return {
      product: { id: li.productId },
      quantity: li.quantity,
      lineItem: serverCart.lineItems.find( item => item.productId === li.productId)
    };
  }); 
}

const removeFromLocalCart = (cart, lineItem)=> {
  const _cart = _.cloneDeep(cart);
  const _lineItem = _cart.lineItems.find( li => li.productId === lineItem.productId );
  _lineItem.quantity--;
  if(_lineItem.quantity === 0){
    _cart.lineItems = _cart.lineItems.filter(li => _lineItem !== li);
  }
  setLocalCart(_cart);
  return Promise.resolve();
};

const getLocalCart = ()=> {
  const defaultCart = {
    status: 'CART',
    lineItems: []
  };
  let cart = JSON.parse(storage.getItem(key));
  if(!cart){
    cart = defaultCart;
    setLocalCart(cart);
  }
  return cart;

}

const setLocalCart = (cart)=> {
  storage.setItem(key, JSON.stringify(cart));
}

export { consolidatedCart, loadOrdersFromLocal, addToLocalCart, removeFromLocalCart };
