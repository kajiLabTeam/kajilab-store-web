import storage from "@/firebase";
import { Product } from "@/types/response";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useState, useEffect } from "react";

export const useFirebaseStorageURL = (product: Product | undefined) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return
    getDownloadURL(ref(storage, `images/${product.barcode}.jpg`))
      .then((url) => {
        setImgUrl(url)
      })
      .catch((error) => {
        setImgUrl("/products/loadFalse.jpg")
      })
  }, [product])
  return [imgUrl]
};