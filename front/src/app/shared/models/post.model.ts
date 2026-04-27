import { User } from './user.model';
import { Topic } from './topic.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  topic: Topic;
  createdAt: string;
}
