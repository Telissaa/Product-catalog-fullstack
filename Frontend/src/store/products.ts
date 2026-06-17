import {
  IProductsData,
  ProductsFromApiType,
  ProductType,
} from "../types/products";

const apiUrl = "http://localhost:5249/api";
const productsEndpoint = `${apiUrl}/products`;

export const getProductsData = async ({
  search,
  category,
  pageNumber,
}: IProductsData = {}): Promise<ProductsFromApiType | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
    const response = await fetch(
      `${productsEndpoint}?${queryParams.toString()}`,
    );
    if (!response.ok) {
      throw new Error(response.statusText || "Failed to fetch products data");
    }
    const data: ProductsFromApiType = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products data:", error);
    return null;
  }
};

export const getProductById = async (
  id: string,
): Promise<ProductType | null> => {
  try {
    const response = await fetch(`${productsEndpoint}/${id}`);
    if (!response.ok) {
      throw new Error(response.statusText || "Failed to fetch product by ID");
    }
    const data: ProductType = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
