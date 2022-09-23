import { convertPrice } from "@libs/client/utils";
import { Product } from "@prisma/client";

interface Products {
  products: Product[];
  //   length: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function Products(products: Products) {
  return products?.length > 0 ? (
    <div className="border-t border-gray-200 pt-5 mt-5">
      <h2 className="text-md font-bold text-gray-900">
        {/* {product?.user.name}님, 이건 어때요? */}
        테스트중
      </h2>
      <div className=" mt-6 grid grid-cols-2 gap-4">
        {products.map((product: Product) => (
          <div key={product.id}>
            <div className="h-56 w-full mb-4 bg-slate-300" />
            <h3 className="text-gray-700 -mb-1">{product.name}</h3>
            <span className="text-sm font-medium text-gray-900">
              {convertPrice(product.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : null;
}
