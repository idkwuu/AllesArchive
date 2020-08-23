import { Breadcrumb } from "./breadcrumb";
import { Item } from "./item";

const BreadcrumbSubcomponents = Breadcrumb as typeof Breadcrumb & {
  Item: typeof Item;
};

BreadcrumbSubcomponents.Item = Item;

export { BreadcrumbSubcomponents as Breadcrumb };
