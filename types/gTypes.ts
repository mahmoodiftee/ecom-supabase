export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}
export interface Receipt {
  id: string;
  date: string;
  customerEmail: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}
