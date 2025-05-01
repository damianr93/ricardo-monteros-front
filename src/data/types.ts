export interface ItemDetail {
    id: string
    title: string
    image: string
    sections: Array<{
      heading: string
      content: React.ReactNode
    }>
  }