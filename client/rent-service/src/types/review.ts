type User = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
}

export type Review = {
  id: string;
  comment: string;
  rating: number;
  date: string;
  user: User;
};

export type Comment = {
  comment: string;
  rating: number;
  id: string;
}
