import * as Admin from "@/app/features/admin/components/Index"

export default async function AdminProductPage({
  params,
}: {
  params: {barcode: number};
}) {
  return (
    <div>
      <Admin.ProductEditor barcode={params.barcode.toString()}/>
    </div>
  )
}