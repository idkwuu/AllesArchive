import { Users as Icon } from "react-feather";
import { Header, Breadcrumb, Avatar } from "@alleshq/reactants";
import { useUser } from "../utils/userContext";
import Head from "next/head";
import Link from "next/link";
import { useTheme } from "../utils/theme";

export default function Page({ title, breadcrumbs, head, children }) {
  const user = useUser();
  useTheme();

  return (
    <>
      <Head>
        <title>{title ? `People • ${title}` : `Alles People`}</title>
        {head}
      </Head>

      <Header>
        <div className="p-5 max-w-2xl w-full mx-auto flex justify-between">
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item className="font-medium text-lg inline-flex items-center">
                <Icon className="text-gray-500 inline w-5 mr-2" />
                People
              </Breadcrumb.Item>
            </Link>

            {breadcrumbs}
          </Breadcrumb>

          {user && (
            <Avatar
              src={`https://avatar.alles.cc/${user.id}?size=40`}
              size={37.5}
            />
          )}
        </div>
      </Header>

      <div className="sm:max-w-xl p-5 mx-auto my-5 space-y-7">{children}</div>
    </>
  );
}
