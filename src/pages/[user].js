import Page from "../components/Page";
import { withRouter } from "next/router";
import { Box, Breadcrumb, Avatar } from "@alleshq/reactants";
import axios from "axios";
import NotFound from "./404";
import cookies from "next-cookies";

const UserPage = withRouter(({ user: u }) => {
  if (!u) return <NotFound />;

  return (
    <Page
      title={u.name}
      breadcrumbs={
        <Breadcrumb.Item>
          <Avatar src={`https://avatar.alles.cc/${u.id}?size=25`} size={25} />
        </Breadcrumb.Item>
      }
    >
      <Box>
        <Box.Content>
          <div className="flex justify-center">
            <div className="relative">
              <Avatar
                src={`https://avatar.alles.cc/${u.id}?size=150`}
                size={150}
              />
            </div>
          </div>

          <h1 className="text-center text-3xl font-medium mt-2">
            {u.name}
            <span className="text-primary text-sm">#{u.tag}</span>
          </h1>
        </Box.Content>
      </Box>

      <Box>
        <Box.Content>
          <div className="flex">
            <p className="flex-grow">Level {u.xp.level}</p>
            <p className="text-right ml-5">{u.xp.total} xp</p>
          </div>
          <div className="w-full h-5 mt-3 rounded-full overflow-hidden border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
            <div
              className="h-full bg-primary"
              style={{
                width: `${u.xp.levelProgress * 100}%`,
              }}
            />
          </div>
        </Box.Content>
      </Box>
    </Page>
  );
});

UserPage.getInitialProps = async (ctx) => {
  const id = ctx.query.user;
  try {
    return {
      user: (
        await axios.get(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/${encodeURIComponent(
            id
          )}`,
          {
            headers: {
              Authorization: cookies(ctx).sessionToken,
            },
          }
        )
      ).data,
    };
  } catch (err) {
    if (ctx.res) ctx.res.statusCode = 404;
    return {};
  }
};

export default UserPage;
