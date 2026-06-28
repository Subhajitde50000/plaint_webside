import { ProductEditPage } from '@/components/admin/products/ProductEditPage';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: `Edit Product ${id} — Hero Plants Admin`,
    description: 'Edit an existing product listing for the Hero Plants storefront.',
  };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  // In production: fetch product data from your API/DB here
  // const product = await getProduct(id);

  return <ProductEditPage mode="edit" productId={id} />;
}
