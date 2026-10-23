export const API_ENDPOINTS = {
  CATEGORIES: "/api/categories",
  PRODUCTS: "/api/products",
  PRODUCT_DETAILS: (id: number | string) => `/api/products/${id}`,
  ENQUIRIES: "/api/enquiries",
};