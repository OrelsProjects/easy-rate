import Stripe from "stripe";

export type Event = Stripe.Event;

export interface PriceStructure {
  id: string;
  price: number;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  unavailable?: boolean;
  priceStructure: PriceStructure;
  features: string[];
  recommended?: boolean;
}
