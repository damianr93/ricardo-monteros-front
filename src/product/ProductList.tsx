import React from 'react'
import ProductCard from './ProductCard'
import { ExampleItem } from '../data/items'

interface ProductListProps {
  items: ExampleItem[]
  isLoggedIn: boolean
  onAddToCart: (item: ExampleItem) => void
}

const ProductList: React.FC<ProductListProps> = ({ items, isLoggedIn, onAddToCart }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map(item => (
      <ProductCard
        key={item.id}
        item={item}
        isLoggedIn={isLoggedIn}
        onAddToCart={onAddToCart}
      />
    ))}
  </div>
)

export default ProductList
