import useSWR from "swr";
import { useState, Suspense } from "react";
import {
  Box,
  Header,
  Breadcrumb,
  BreadcrumbItem,
  Avatar,
  Textarea,
  Button,
} from "@reactants/ui";
import {
  Circle,
  Settings as Cog,
  User as UserIcon,
  Users,
  AtSign,
  Image,
  Plus,
  Minus,
} from "react-feather";

import { fetcher } from "../lib";
import { Item, ItemTypes } from "../types";
import { Post } from "../components";

const isServer = typeof window === "undefined";

const ItemsFallback = () => (
  <>
    {Array.from({ length: 5 }, (v, k) => k + 1).map((key) => (
      <Post skeleton key={key} />
    ))}
  </>
);

const Items = () => {
  const { data } = useSWR<{ feed: Item[] }>("/api/feed", fetcher, {
    suspense: true,
  });

  return (
    <>
      {data.feed.map((item) => {
        switch (item.type) {
          case ItemTypes.Post:
            return <Post key={item.slug} {...item} />;
          default:
            console.warn("Unimplemented item type", item.type);
            return null;
        }
      })}
    </>
  );
};

export default () => {
  const [value, setValue] = useState<string>();

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

      <main className="sm:max-w-xl p-5 mx-auto my-5 space-y-7">
        <div className="space-y-7">
          <div className="flex justify-between">
            <h4 className="font-medium text-3xl">
              Hey, Dante<sup className="select-none text-primary">+</sup>
            </h4>

            <div className="flex space-x-4">
              <a className="transition duration-100 hover:opacity-75" href="#">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <Cog />
                </Box>
              </a>
              <a className="transition duration-100 hover:opacity-75" href="#">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <UserIcon />
                </Box>
              </a>
              <a className="transition duration-100 hover:opacity-75" href="#">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <AtSign />
                </Box>
              </a>
              <a className="transition duration-100 hover:opacity-75" href="#">
                <Box className="rounded-full p-2 text-gray-600 dark:text-gray-300">
                  <Users />
                </Box>
              </a>
            </div>
          </div>

          <Box>
            <Textarea
              placeholder="What's up?"
              className="text-base"
              rows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                padding: "15px",
              }}
            />

            <Box.Footer className="flex justify-between">
              <Button
                color="transparent"
                style={{ padding: "0 5px" }}
                size="lg"
              >
                <Image size={20} strokeWidth={1.75} />
              </Button>
              <Button disabled={!value} size="sm">
                Post
              </Button>
            </Box.Footer>
          </Box>
        </div>

        {!isServer && (
          <Suspense fallback={<ItemsFallback />}>
            <Items />
          </Suspense>
        )}
      </main>
    </>
  );
};
