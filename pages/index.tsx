import { Box } from "@reactants/ui";
import { User, Shield, Icon } from "react-feather";
import { Fragment } from "react";

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
    <main className="sm:max-w-2xl p-5 mx-auto my-5 space-y-7">
      <h4 className="font-medium text-3xl">
        Hey, Dante<sup className="select-none text-primary">+</sup>
      </h4>

      <div className="flex space-x-3">
        {categories.map((category, i) => (
          <Box className="flex-1" key={i}>
            <Box.Header className="flex items-center space-x-2">
              <category.icon size={18.5} className="text-primary" />
              <span>{category.name}</span>
            </Box.Header>

            {category.links.map((link, i) => (
              <Fragment key={i}>
                {i >= 1 && <hr className="opacity-25" />}
                <Box.Content>
                  <a
                    className="hover:text-primary transition duration-200 ease"
                    href={link.href}
                  >
                    {link.text}
                  </a>
                </Box.Content>
              </Fragment>
            ))}
          </Box>
        ))}
      </div>
    </main>
  );
};
