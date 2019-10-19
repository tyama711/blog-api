import mongoose from 'mongoose'
import IArticleModel from '../../model/interfaces/article-model'

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
  updateDate: {
    type: Date,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
    required: false,
  },
  content: {
    type: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
})

const ArticleSchema = mongoose.model<IArticleModel>(
  'article',
  schema,
  'articles',
  true
)

export default ArticleSchema
