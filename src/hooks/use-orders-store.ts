import { useSyncExternalStore, useCallback } from "react";
import * as store from "@/data/orders-store";

export function useOrders() {
  const orders = useSyncExternalStore(store.subscribe, store.getOrders);
  return orders;
}

export function useOrder(id: string) {
  const getSnapshot = useCallback(() => store.getOrder(id), [id]);
  const order = useSyncExternalStore(store.subscribe, getSnapshot);
  return order;
}

export { store };
