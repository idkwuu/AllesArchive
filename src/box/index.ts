import { Box } from "./box";
import { Content } from "./content";
import { Footer } from "./footer";
import { Header } from "./header";

const BoxSubcomponents = Box as typeof Box & {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
};

BoxSubcomponents.Header = Header;
BoxSubcomponents.Content = Content;
BoxSubcomponents.Footer = Footer;

export { BoxSubcomponents as Box };
