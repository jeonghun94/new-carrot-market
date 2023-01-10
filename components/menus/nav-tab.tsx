interface Menu {
  name: string;
}

interface Menus {
  menus: Menu[];
  tabNumber: number;
  setTabNumber: (value: number) => void;
}

export default function TabMenus({ menus, tabNumber, setTabNumber }: Menus) {
  return (
    <div className="w-full">
      <ul className="flex flex-wrap flex-row mt-2 border-b" role="tablist">
        {menus.map((menu, index) => (
          <li className="flex-auto text-center bg-white z-30" key={index}>
            <a
              className={`text-sm font-bold uppercase p-3  block leading-normal text-gray-500 ${
                tabNumber === index
                  ? "text-black  border-b-black border-b-2 "
                  : null
              }}`}
              onClick={(e) => {
                e.preventDefault();
                setTabNumber(index);
              }}
              data-toggle="tab"
              href={`#link${index}`}
              role="tablist"
            >
              {menu.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
