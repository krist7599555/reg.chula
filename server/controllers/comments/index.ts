import { ObjectID } from 'mongodb';
import * as _ from 'lodash';
export async function comments_create(ctx: Context) {
  const { username } = await ctx.profile();
  const { message, anonymous, parent } = ctx.request.body;
  const newpost = await ctx.posts.insertOne({
    owner: username,
    create: new Date().toISOString(),
    message,
    anonymous,
    likes: [],
    comments: [],
    parent
  });
  await ctx.posts.findOneAndUpdate(
    { _id: parent },
    { $push: { posts: newpost.insertedId } },
    { upsert: true }
  );
  return ctx.ok(newpost);
}

export async function comments_download(ctx: Context) {
  const id = ctx.params.id;
  console.log(id);
  const arr = await ctx.posts
    .aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'posts',
          localField: 'posts',
          foreignField: '_id',
          as: 'posts'
        }
      }
    ])
    .toArray();
  ctx.ok(_.get(arr, '[0].posts', []));
}
