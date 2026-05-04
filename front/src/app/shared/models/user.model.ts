import { Topic } from "./topic.model";

export interface User {
  id: number;
  email: string;
  username: string;
  subscriptions?: Topic[];
}
