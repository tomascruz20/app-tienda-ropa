export const STORE_NAME = 'URBAN STORE';
export const FREE_SHIPPING_FROM = 50000;
export const SHIPPING_COST = 3500;

export const COLORS = {
  primary: '#111827',
  accent: '#E11D48',
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#111827',
  textSoft: '#6B7280',
  border: '#E5E7EB',
  success: '#16A34A',
  danger: '#DC2626',
  white: '#FFFFFF',
};

export const formatPrice = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');