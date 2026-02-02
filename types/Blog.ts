export type BlogType = {
  _id: string;
  title: string;
  body: string;
  thumbnail: string;
  category: {
    _id: string;
    name: string;
    image: string;
  };
  tags: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};
