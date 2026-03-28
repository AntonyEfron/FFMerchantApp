import apiClient from './client';
import type { Brand, BrandPayload, Product, Category, Attribute } from '@/src/types';

// ===== Products =====

export const addBaseProduct = async (productData: any) => {
  const res = await apiClient.post('merchant/addBaseProduct', productData);
  return res.data;
};

export const fetchProductsByMerchantId = async (
  merchantId: string
): Promise<Product[]> => {
  try {
    const res = await apiClient.get(
      `merchant/fetchProductsByMerchantId/${merchantId}`
    );
    return res.data;
  } catch {
    return [];
  }
};

export const getBaseProductById = async (productId: string) => {
  const res = await apiClient.get(
    `merchant/getBaseProductById/${productId}`
  );
  return res.data;
};

export const editProduct = async (
  productId: string,
  data: Record<string, any>
) => {
  const res = await apiClient.patch(
    `merchant/editProduct/${productId}`,
    data,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
};

export const deleteProduct = async (productId: string) => {
  const res = await apiClient.delete(
    `merchant/deleteProduct/${productId}`
  );
  return res.data;
};

// ===== Variants =====

export const addVariant = async (productId: string, formData: FormData) => {
  const res = await apiClient.post(
    `merchant/addVariant/${productId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};

export const updateVariant = async (
  productId: string,
  variantId: string,
  formData: FormData
) => {
  const res = await apiClient.patch(
    `merchant/updateVariant/${productId}/${variantId}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return res.data;
};

export const deleteVariant = async (
  productId: string,
  variantId: string
) => {
  const res = await apiClient.delete(
    `merchant/deleteVariant/${productId}/${variantId}`
  );
  return res.data;
};

// ===== Stock & Sizes =====

export const updateStock = async (
  productId: string,
  variantId: string,
  data: any
) => {
  const res = await apiClient.patch(
    `merchant/updateMultipleVariantSizes/${productId}/${variantId}`,
    data,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
};

export const deleteSize = async (
  productId: string,
  variantId: string,
  sizeId: string
) => {
  const res = await apiClient.delete(
    `merchant/deleteSize/${productId}/${variantId}/${sizeId}`
  );
  return res.data;
};

export const deleteVariantSizes = async (
  productId: string,
  variantId: string,
  sizeId: string
) => {
  const res = await apiClient.delete(
    `/merchant/deleteSizes/${productId}/${variantId}/${sizeId}`
  );
  return res.data;
};

// ===== Price =====

export const updatePrice = async (
  productId: string,
  variantId: string,
  priceData: { mrp: number; price: number; discount?: number }
) => {
  const res = await apiClient.put(
    `merchant/updatePrice/${productId}/${variantId}`,
    priceData
  );
  return res.data;
};

// ===== Images =====

export const uploadImage = async (
  uri: string,
  productId: string,
  variantIndex: number
) => {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'image.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('images', {
    uri,
    name: filename,
    type,
  } as any);
  formData.append('productId', productId);
  formData.append('variantIndex', variantIndex.toString());

  const res = await apiClient.post('/merchant/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteImage = async (imageId: string) => {
  const { data } = await apiClient.delete(`merchant/deleteImage/${imageId}`);
  return data;
};

// ===== Categories & Attributes =====

export const getCategories = async (): Promise<Category[]> => {
  const res = await apiClient.get('/merchant/getCategories');
  return res.data;
};

export const getAttributes = async (categoryId?: string): Promise<Attribute[]> => {
  const url = categoryId
    ? `/merchant/attributes?categoryId=${categoryId}`
    : '/merchant/attributes';
  const res = await apiClient.get(url);
  return res.data;
};

// ===== Brands =====

export const addBrand = async (brand: BrandPayload): Promise<{ brand: Brand }> => {
  const formData = new FormData();
  formData.append('name', brand.name);
  formData.append('description', brand.description);
  formData.append('createdByType', brand.createdByType);
  formData.append('createdById', brand.createdById);

  if (brand.logo) {
    const uri = brand.logo.uri || brand.logo;
    const filename = typeof uri === 'string' ? (uri.split('/').pop() || 'logo.jpg') : 'logo.jpg';
    formData.append('logo', {
      uri,
      name: filename,
      type: 'image/jpeg',
    } as any);
  }

  const res = await apiClient.post('/merchant/brand/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getBrands = async (merchantId: string): Promise<Brand[]> => {
  const res = await apiClient.get(
    `/merchant/brand/get?merchantId=${merchantId}`
  );
  return res.data;
};

export const deleteBrand = async (
  merchantId: string,
  brandId: string
) => {
  const res = await apiClient.delete('/merchant/brand/deleteBrand', {
    params: { merchantId, brandId },
  });
  return res.data;
};

// ===== Product Details =====

export const saveProductDetails = async (
  productId: string,
  productData: any
) => {
  const res = await apiClient.put(
    `merchant/products/${productId}/details`,
    productData
  );
  return res.data;
};
