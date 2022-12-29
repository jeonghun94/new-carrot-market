import { convertTime } from "@libs/client/utils";
import { ProductWithCount } from "pages";
import useSWR from "swr";
import EmptyLayout from "./empty-layout";
import Item from "./item";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases";
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const commentTitle = (kind: string) => {
    const titles = [
      {
        kind: "purchases",
        title: "구매",
      },
      {
        kind: "sales",
        title: "판매",
      },
      {
        kind: "favs",
        title: "관심",
      },
    ];

    return titles.find((item) => item.kind === kind)?.title;
  };

  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);

  return data && data[kind].length > 0 ? (
    <div className="mt-2 space-y-5 divide-y">
      {data[kind]?.map((record) => (
        <Item
          key={record.id}
          id={record.product.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.favs}
          image={record.product?.image}
          state={record.product.state}
          createdAt={convertTime(record.product.createdAt.toString())}
          chats={record.product._count.chats}
        />
      ))}
    </div>
  ) : (
    <EmptyLayout comment={`${commentTitle(kind)} 목록이 없습니다.`} />
  );
}
