import { Item } from "./item";
import { Menu } from "./menu";

const MenuWithSubcomponents = Menu as typeof Menu & {
  Item: typeof Item;
};

MenuWithSubcomponents.Item = Item;

export { MenuWithSubcomponents as Menu };
