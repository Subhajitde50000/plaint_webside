import { ProductEditPage } from '@/components/admin/products/ProductEditPage';

export const metadata = {
  title: 'Add New Product — Hero Plants Admin',
  description: 'Create a new product listing for the Hero Plants storefront.',
};

export default function NewProductPage() {
  return <ProductEditPage mode="new" />;
}
