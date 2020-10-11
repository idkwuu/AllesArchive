import Page from "../components/Page";
import { withRouter } from "next/router";
import { Box, Breadcrumb, Avatar } from "@alleshq/reactants";
import axios from "axios";
import NotFound from "./404";
import cookies from "next-cookies";
import { useState, useEffect } from "react";
import moment from "moment";
import { Award, Map } from "react-feather";
import countries from "../data/countries";

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
      <div className="flex space-x-5">
        <Avatar src={`https://avatar.alles.cc/${u.id}?size=150`} size={150} />
        <div className="space-y-2">
          <div>
            <h1 className="text-3xl font-medium mt-2">
              {u.name}
              <span className="text-primary text-sm">#{u.tag}</span>
            </h1>
            {u.country && countries[u.country] && (
              <InfoLabel icon={Map}>{countries[u.country]}</InfoLabel>
            )}
            <InfoLabel icon={Award}>
              Level {u.xp.level} ({u.xp.total}xp)
            </InfoLabel>
          </div>

          <Status id={u.id} />
        </div>
      </div>
    </Page>
  );
});

UserPage.getInitialProps = async (ctx) => {
  const id = ctx.query.user;
  const { sessionToken } = cookies(ctx);
  try {
    return {
      user: (
        await axios.get(
          `${process.env.NEXT_PUBLIC_ORIGIN}/api/users/${encodeURIComponent(
            id
          )}`,
          {
            headers: sessionToken
              ? {
                  Authorization: sessionToken,
                }
              : {},
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

const InfoLabel = ({ icon: Icon, children }) => (
  <p className="flex text-gray-700 dark:text-gray-300">
    <Icon className="text-primary mr-1 my-auto" height={18} /> {children}
  </p>
);

const Status = ({ id }) => {
  const [status, setStatus] = useState();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setStatus(
          (await axios.get(`https://wassup.alles.cc/${encodeURIComponent(id)}`))
            .data.status
        );
      } catch (err) {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return status ? (
    <div>
      <p className="italic">“{status.content}”</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {moment(status.date).fromNow()}
      </p>
    </div>
  ) : (
    <></>
  );
};
