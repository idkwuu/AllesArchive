import { User } from "./user";

export enum ItemTypes {
  Post = "post",
}

export interface Item {
  type: ItemTypes;
  replyCount: number;
  score: number;
  createdAt: string;
  slug: string;
  author: User;
  content: string;
  image: string;
}
