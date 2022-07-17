export type Post = {
  slug: string;
  title: string;
  poster: string;
  description: string;
  postedAt: string;
  tags: string[];
};

export type PostDetail = {
  slug: string;
  title: string;
  poster: string;
  description: string;
  postedAt: string;
  tags: string[];
  content: string;
};
