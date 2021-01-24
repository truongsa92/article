interface Comment {
  id: number;
  parentId?: number;
  content: string;
  nickname: string;
  child?: []
}

interface Article {
  id: number;
  title: string;
  content: string;
  nickname: string;
  created: Date
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: Article;
}

export interface ArticlesRO {
  articles: Article[];
  total: number;
}

