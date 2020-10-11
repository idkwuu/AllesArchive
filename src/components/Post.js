import { Avatar, Box, Button } from "@alleshq/reactants";
import { Plus, Minus, MessageCircle } from "react-feather";
import moment from "moment";

export default function Post({
  url,
  authorId,
  authorName,
  authorPlus,
  score,
  content,
  image,
  link,
  date,
  replies,
}) {
  return (
    <Box>
      <a
        href={url}
        className="flex w-full min-w-0 hover:opacity-75 transition duration-100 cursor-pointer"
      >
        <div className="space-y-3 flex bg-white rounded-tl-lg rounded-bl-lg dark:bg-gray-750 border-r p-2.5 border-gray-200 dark:border-gray-700 flex-col items-center justify-center">
          <Button style={{ padding: 0 }} color="transparent">
            <Plus size={17.5} />
          </Button>
          <span>{score}</span>
          <Button style={{ padding: 0 }} color="transparent">
            <Minus size={17.5} />
          </Button>
        </div>
        <div>
          <Box.Content>
            <div className="flex items-center mb-3">
              <Avatar
                src={`https://avatar.alles.cc/${authorId}?size=35`}
                className="mr-3"
                size={32.5}
              />
              <div>
                <div className="text-black dark:text-white text-lg">
                  {authorName}
                  {authorPlus && (
                    <sup className="select-none text-primary">+</sup>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {content}
            </div>
            {image && (
              <img
                className="mt-5 w-full rounded-lg"
                src={`https://walnut1.alles.cc/${image}`}
              />
            )}
            {link && (
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700 px-3 py-1 italic overflow-hidden box-border truncate">
                {link}
              </div>
            )}
          </Box.Content>
          <Box.Footer className="rounded-bl-none flex justify-between bg-transparent cursor-pointer">
            <span>{moment(date).fromNow()}</span>
            <span className="flex items-center">
              {replies}
              <MessageCircle className="ml-1.5" size={17} />
            </span>
          </Box.Footer>
        </div>
      </a>
    </Box>
  );
}
