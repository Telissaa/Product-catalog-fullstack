import { CategoryType } from "./categories";
import { CommentType } from "./comments";

export type ProductType = {
  id: number;
  categories: string[];
  comments: CommentType[];
  title: string;
  description: string;
  isDeleted: boolean;
  creationDate: string;
  creatorUserName: string;
  imageUrl: string;
};

export type ProductsFromApiType = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  products: ProductType[];
};
export type IProductsData = {
  search?: string;
  category?: string;
  pageNumber?: number;
};
