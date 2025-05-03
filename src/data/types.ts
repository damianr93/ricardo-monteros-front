export interface ItemDetail {
  id: string
  title: string
  image: string
  sections: Array<{
    heading: string
    content: React.ReactNode
  }>
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
  description?: string;
  user: string;
  category: string;
  img?: string;
}