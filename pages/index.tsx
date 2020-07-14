import { Header, Breadcrumb, BreadcrumbItem, Avatar, Box } from "@reactants/ui";
import { Circle, User, Shield, Icon } from "react-feather";

interface Category {
  name: string;
  icon: Icon;
  links: { text: string; href: string }[];
}

const categories: Category[] = [
  {
    name: "Security",
    icon: Shield,
    links: [
      { text: "Passphrase", href: "/passphrase" },
      { text: "Multi-factor authentication", href: "/mfa" },
      { text: "Active Sessions", href: "/sessions" },
      { text: "Authorized Applications", href: "/apps" },
    ],
  },
  {
    name: "Profile",
    icon: User,
    links: [
      {
        text: "Contact details",
        href: "/contact",
      },
      {
        text: "Personal info",
        href: "/info",
      },
    ],
  },
];

export default () => {
  return (
    <>
      <Header>
        <div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
          <Breadcrumb>
            <BreadcrumbItem
              href="#"
              className="font-medium text-lg inline-flex items-center"
            >
              <Circle className="text-gray-500 inline w-5 mr-2" />
              Alles
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="flex items-center">
            <Avatar username="dante" size={37.5} />
          </div>
        </div>
      </Header>

      <main className="sm:max-w-2xl p-5 mx-auto my-5 space-y-7">
        <h4 className="font-medium text-3xl">
          Hey, Dante<sup className="select-none text-primary">+</sup>
        </h4>

        <div className="flex space-x-3">
          {categories.map((category) => (
            <Box className="flex-1">
              <Box.Header className="flex items-center space-x-2">
                <category.icon size={18.5} className="text-primary" />
                <span>{category.name}</span>
              </Box.Header>

              {category.links.map((link, i) => (
                <>
                  {i >= 1 && <hr className="opacity-25" />}
                  <Box.Content>
                    <a
                      className="hover:text-primary transition duration-200 ease"
                      href={link.href}
                    >
                      {link.text}
                    </a>
                  </Box.Content>
                </>
              ))}
            </Box>
          ))}
        </div>
      </main>
    </>
  );
};
