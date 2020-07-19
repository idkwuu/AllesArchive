import {
  Header,
  Breadcrumb,
  Popover,
  Avatar,
  Transition,
  Menu,
} from "@reactants/ui";
import { Circle, Bell } from "react-feather";
import "@reactants/ui/dist/index.css";

export default ({ Component, pageProps }) => {
  const toggleDarkTheme = (e: React.MouseEvent<SVGAElement, MouseEvent>) => {
    e.preventDefault();

    if (document.documentElement.classList.contains("dark")) {
      return document.documentElement.classList.remove("dark");
    }

    document.documentElement.classList.add("dark");
  };

  return (
    <>
      <Header>
        <div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
          <Breadcrumb>
            <Breadcrumb.Item
              href="#"
              className="font-medium text-lg inline-flex items-center"
            >
              <Circle
                onClick={toggleDarkTheme}
                className="text-gray-500 inline w-5 mr-2"
              />
              Alles
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex items-center space-x-3">
            <div className="select-none cursor-pointer hover:bg-danger-85 transition duration-200 ease bg-danger text-white rounded-full flex items-center justify-center py-0.5 px-2.5 space-x-1">
              <Bell size={0.35 * 37.5} />
              <span>2</span>
            </div>

            <Popover
              className="relative inline-block"
              trigger={(onClick) => (
                <Avatar
                  onClick={onClick}
                  className="select-none cursor-pointer hover:opacity-85 transition duration-200 ease"
                  username="dante"
                  size={35}
                />
              )}
              content={(isOpen) => (
                <Transition
                  show={isOpen}
                  enter="transition ease-out duration-100 transform"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75 transform"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu className="absolute origin-top-right right-0">
                    <Menu.Item>Settings</Menu.Item>
                    <Menu.Item>Log out</Menu.Item>
                  </Menu>
                </Transition>
              )}
            />
          </div>
        </div>
      </Header>

      <Component {...pageProps} />
    </>
  );
};
