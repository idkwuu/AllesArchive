import Page from "../components/Page";
import { Box } from "@alleshq/reactants";
import { useState, useEffect } from "react";
import { useTheme } from "../utils/theme";
import { useUser } from "../utils/userContext";
import Link from "next/link";
import { User, Sun, Moon } from "react-feather";
import StatusField from "../components/StatusField";

export default function Home() {
  const user = useUser();
  const { theme, toggleTheme } = useTheme();
  const [ThemeIcon, setThemeIcon] = useState(Moon);

  // Theme Icon
  useEffect(() => {
    setThemeIcon(theme === "light" ? Moon : Sun);
  }, [theme]);

  return (
    <Page>
      <div className="space-y-7">
        <div className="sm:flex justify-between">
          <h4 className="font-medium text-3xl">
            Hey, {user.nickname}
            {user.plus && <sup className="select-none text-primary">+</sup>}
          </h4>

          <div className="flex space-x-4 my-auto">
            <Link
              href="/[user]"
              as={`/${user.username ? user.username : user.id}`}
            >
              <a className="transition duration-100 hover:opacity-75">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <User />
                </Box>
              </a>
            </Link>

            <a
              className="transition duration-100 hover:opacity-75 cursor-pointer"
              onClick={() => toggleTheme()}
            >
              <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                <ThemeIcon />
              </Box>
            </a>
          </div>
        </div>
        <StatusField />
      </div>
    </Page>
  );
}
