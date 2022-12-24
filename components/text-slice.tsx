export default function TextSlice(item: any) {
  const len = Number(item.length);

  return len > 150 ? (
    <>
      {/* <span>
        {item.slice(0, 150)}...<span className="text-gray-500">더보기</span>
      </span> */}
    </>
  ) : (
    item
  );
}
