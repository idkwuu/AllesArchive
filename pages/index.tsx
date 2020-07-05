import useSWR from "swr";
import { useState, useEffect, Suspense } from "react";
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

import { FeedItem } from "../types";

const isServer = typeof window === "undefined";
const authorization = process.env.NEXT_PUBLIC_AUTH;

async function fetcher<T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  return await fetch(input, {
    ...init,
    headers: { authorization },
  }).then((res) => res.json());
}

const SkeletonPost: React.FC = () => (
  <Box className="flex">
    <div className="space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center">
      <Button color="transparent" style={{ padding: 0, opacity: 0.5 }}>
        <Plus size={17.5} />
      </Button>
      <span className="w-3 h-3" />
      <Button color="transparent" style={{ padding: 0, opacity: 0.5 }}>
        <Minus size={17.5} />
      </Button>
    </div>

    <a className="block hover:opacity-75 transition duration-100 cursor-pointer w-full">
      <Box.Content>
        <div className="flex items-center mb-3">
          <div
            className="mr-3 bg-gray-200 rounded-full"
            style={{ width: 32.5, height: 32.5 }}
          />
          <div className="space-y-1">
            <div className="bg-gray-200 rounded-sm dark:bg-white h-3 w-10" />
            <div className="bg-gray-200 rounded-sm h-3 w-15" />
          </div>
        </div>
        <div className="bg-gray-200 h-15 rounded w-full"></div>
      </Box.Content>
      <Box.Footer
        className="rounded-bl-none flex justify-between"
        style={{ background: "transparent" }}
      >
        <span className="bg-gray-200 w-20 h-3 rounded-sm" />
        <span className="bg-gray-200 w-13 h-3 rounded-sm" />
      </Box.Footer>
    </a>
  </Box>
);

const Post: React.FC<Omit<FeedItem, "type">> = ({
  content,
  replyCount,
  score,
  author,
  createdAt,
  slug,
}) => (
  <Box className="flex">
    <div className="space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center">
      <Button color="transparent" style={{ padding: 0 }}>
        <Plus size={17.5} />
      </Button>
      <span>{score}</span>
      <Button color="transparent" style={{ padding: 0 }}>
        <Minus size={17.5} />
      </Button>
    </div>

    <a
      href={`/p/${slug}`}
      className="block hover:opacity-75 transition duration-100 cursor-pointer w-full"
    >
      <Box.Content>
        <div className="flex items-center mb-3">
          <Avatar username="archie" className="mr-3" size={32.5} />
          <div>
            <div className="text-black dark:text-white text-sm">
              {author.name}
              {author.plus && <sup className="select-none text-primary">+</sup>}
            </div>
            <div className="text-primary text-sm">@{author.username}</div>
          </div>
        </div>
        <div>{content}</div>
      </Box.Content>
      <Box.Footer
        className="rounded-bl-none flex justify-between cursor-pointer"
        style={{ background: "transparent" }}
      >
        <span>{new Date(createdAt).toLocaleString()}</span>
        <span>{replyCount === 0 ? "No" : replyCount} Replies</span>
      </Box.Footer>
    </a>
  </Box>
);

const Feed = () => {
  const { data } = useSWR<{ feed: FeedItem[] }>("/api/feed", fetcher, {
    suspense: true,
  });

  return (
    <>
      {data.feed.map(
        (item) =>
          item.type === "post" && (
            <Post
              content={item.content}
              replyCount={item.replyCount}
              score={item.score}
              key={item.slug}
              slug={item.slug}
              author={item.author}
              createdAt={item.createdAt}
            />
          )
      )}
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

      <div className="sm:max-w-xl p-5 mx-auto my-5 space-y-7">
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
          <Suspense
            fallback={
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => (
                  <SkeletonPost key={key} />
                ))}
              </>
            }
          >
            <Feed />
          </Suspense>
        )}
      </div>
    </>
  );
};
