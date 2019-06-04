import mongoose from "mongoose";

type ContentType = "plain" | "markdown";

export default interface ArticleModel extends mongoose.Document {
  userId: string;
  createDate: Date;
  updateDate?: Date;
  title: string;
  abstract?: string;
  content: {
    type: ContentType;
    body: string;
  };
}
