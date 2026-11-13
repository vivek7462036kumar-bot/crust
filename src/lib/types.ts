export type Category = 'PIZZA' | 'SIDE' | 'DRINK' | 'DESSERT';

export type DietaryBadge = 'VEGETARIAN' | 'VEGAN' | 'SPICY' | 'CHEF_SPECIAL';

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  badges: string; // Comma separated
  inStock: boolean;
  isFeatured: boolean;
  baseSize?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type IngredientCategory =
  | 'SIZE'
  | 'CRUST'
  | 'SAUCE'
  | 'CHEESE'
  | 'TOPPING_MEAT'
  | 'TOPPING_VEG'
  | 'TOPPING_FINISH';

export interface CustomIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  price: number;
  multiplier: number;
  isDefault: boolean;
  inStock: boolean;
}

export interface CustomPizzaConfig {
  size: CustomIngredient;
  crust: CustomIngredient;
  sauce: CustomIngredient;
  cheese: CustomIngredient;
  toppings: CustomIngredient[];
  calculatedPrice: number;
}

export interface CartItem {
  id: string; // Unique cart item ID (uuid or composite)
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  isCustom: boolean;
  customDetails?: {
    size: string;
    crust: string;
    sauce: string;
    cheese: string;
    toppings: string[];
  };
  itemNotes?: string;
}

export type OrderStatus =
  | 'RECEIVED'
  | 'PREPARING'
  | 'BAKING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItemRecord {
  id: string;
  orderId: string;
  name: string;
  isCustom: boolean;
  size?: string | null;
  crust?: string | null;
  sauce?: string | null;
  cheese?: string | null;
  toppings?: string | null; // JSON string
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemNotes?: string | null;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'DELIVERY' | 'PICKUP';
  deliveryAddress?: string | null;
  deliveryInstructions?: string | null;
  pickupTime?: string | null;
  status: OrderStatus;
  paymentMethod: 'CARD' | 'COD' | 'UPI';
  paymentStatus: 'PAID' | 'PENDING';
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
}

export interface PromoValidationResult {
  valid: boolean;
  message: string;
  discountPercent?: number;
  discountAmount?: number;
  discountTotal?: number;
  code?: string;
}

