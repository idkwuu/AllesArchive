import { Box, Button, Avatar } from "@reactants/ui";
import { Plus, Minus, MessageCircle } from "react-feather";

import { Item } from "../types";

export const Post: React.FC<Partial<Item> & { skeleton?: boolean }> = ({
  content,
  replyCount,
  score,
  author,
  createdAt,
  slug,
  image,
  skeleton = false,
}) => (
  <Box className="flex">
    <div className="space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center">
      <Button
        color="transparent"
        style={{ padding: 0, ...(skeleton && { opacity: 0.5 }) }}
      >
        <Plus size={17.5} />
      </Button>
      {skeleton ? (
        <span className="w-3 h-3 bg-gray-200 rounded-full" />
      ) : (
        <span>{score}</span>
      )}
      <Button
        color="transparent"
        style={{ padding: 0, ...(skeleton && { opacity: 0.5 }) }}
      >
        <Minus size={17.5} />
      </Button>
    </div>

    <a
      href={`/p/${slug}`}
      className="block hover:opacity-75 transition duration-100 cursor-pointer w-full"
    >
      <Box.Content>
        {skeleton ? (
          <>
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
          </>
        ) : (
          <>
            <div className="flex items-center mb-3">
              <Avatar username={author.username} className="mr-3" size={32.5} />
              <div>
                <div className="text-black dark:text-white text-sm">
                  {author.name}
                  {author.plus && (
                    <sup className="select-none text-primary">+</sup>
                  )}
                </div>
                <div className="text-primary text-sm">@{author.username}</div>
              </div>
            </div>
            <div>{content}</div>
            {image && <img className="mt-5 rounded-lg" src={image} />}
          </>
        )}
      </Box.Content>
      <Box.Footer
        className="rounded-bl-none flex justify-between cursor-pointer"
        style={{ background: "transparent" }}
      >
        {skeleton ? (
          <>
            <span className="bg-gray-200 w-20 h-3 rounded-sm" />
            <span className="bg-gray-200 w-13 h-3 rounded-sm" />
          </>
        ) : (
          <>
            <span>{new Date(createdAt).toLocaleString()}</span>
            <span className="flex items-center">
              {replyCount}
              <MessageCircle className="ml-1.5" size={17} />
            </span>
          </>
        )}
      </Box.Footer>
    </a>
  </Box>
);
