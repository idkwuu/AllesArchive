import { User } from "./user";

export interface FeedItem {
  type: "post";
  replyCount: number;
  score: number;
  createdAt: string;
  slug: string;
  author: User;
  content: string;
}
