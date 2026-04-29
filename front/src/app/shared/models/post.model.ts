import { Comment } from './comment.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  topicName: string;
  createdAt: string;
}

export interface PostDetail extends Post {
  comments: Comment[];
}
