export interface ItemDetail {
  id: string
  title: string
  image: string
  sections: Array<{
    heading: string
    content: React.ReactNode
  }>
}

export interface Image {
  key: string
  url: string
  type: string
  size: number
  lastModified: string
}

export interface Category {
  id: string;
  name: string;
  available: boolean;
  user: string;
}

export interface Product {
  id: string;
  name: string;
  available: boolean;
  price: number;
  title?: string;
  codigo?: number | string;
  description?: string;
  user: string;
  category: Category;
  img?: string[] | undefined;
}