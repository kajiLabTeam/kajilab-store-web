import { Product } from '@/types/response';
import { Card, Group, Image, Text, useMatches } from '@mantine/core'
import React from 'react'

type ProductCardListProps = {
  product: Product;
}

const ProductCard = ({product}: ProductCardListProps) => {
  const imgPath = `https://firebasestorage.googleapis.com/v0/b/kajilab-store.appspot.com/o/images%2F${product.barcode}.jpg?alt=media&token=c46357bc-f29c-4d5f-8048-33c1d4a65083`
  const pdSize = useMatches({
    base: 'xs',
    md: 'lg',
  })
  return (
    <Card 
      shadow="sm"
      padding={pdSize}
      radius="md"
      withBorder
      className="w-40 md:w-72 bg-slate-50 text-xs md:text-base"
    >
      <Card.Section>
        <Image
          src={imgPath}
          w="auto"
          fit="contain"
          alt="Norway"
          className="mx-auto mt-1 h-20 md:h-40"
          onError={(e) => (e.currentTarget.src = "/images/gettingreadyproductimg.jpg")}
        />
      </Card.Section>

      <Group justify="space-between" mt="xs">
        <Text className='text-xs md:text-base' fw={700}>{product.name}</Text>
      </Group>

      <div>
        <p>
          値段：{product.price}<br/>
          在庫数：{product.stock}
        </p>
      </div>
    </Card>
  )
}

export default ProductCard