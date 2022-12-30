import { cls } from "@libs/client/utils";
import { useState } from "react";

interface Menu {
  id: number;
  name: string;
}

interface Menus {
  menus: Menu[];
}

export default function TabMenus({ menus }: Menus) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full">
      <ul className="flex flex-wrap flex-row mt-2 border-b" role="tablist">
        {menus.map((menu, index) => (
          <li className="flex-auto text-center bg-white z-30" key={index}>
            <a
              className={`text-sm font-bold uppercase p-3  block leading-normal text-gray-500 ${
                selected === index
                  ? "text-black  border-b-black border-b-2 "
                  : null
              }}`}
              onClick={(e) => {
                e.preventDefault();
                setSelected(index);
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
