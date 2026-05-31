import type { TypedUseSelectorHook } from 'react-redux';

import { useDispatch, useSelector } from 'react-redux';

import type { RootDispatch, RootState } from '@/store/store';

type DispatchFunction = () => RootDispatch;

export const useCartDispatch: DispatchFunction = useDispatch;
export const useCartSelector: TypedUseSelectorHook<RootState> = useSelector;
