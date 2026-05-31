import { configureStore } from '@reduxjs/toolkit';

import { cartSlice } from '@/store/cart-slice';

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

// const cartQuantity = useCartSelector((state) =>
//   state.cart.items.reduce((acc, item) => acc + item.quantity, 0),
// );
// const totalPrice = useCartSelector((state) =>
//   state.cart.items.reduce(
//     (acc, item) => acc + item.variant.price * item.quantity,
//     0,
//   ),
// );
