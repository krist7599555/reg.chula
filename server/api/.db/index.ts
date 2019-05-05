import * as schema from "./schema";
import * as mongoose from "mongoose";
import * as config from "@config/mongo";
import { User } from "@/types/Users";
import { Course } from "@/types/Course";
import { CourseList } from "@/types/CourseList";
import { Document } from "mongoose";

mongoose.set("useFindAndModify", false);
mongoose.set("useUpdate", false);
const client = mongoose.createConnection(config.url, {
  useNewUrlParser: true
});

export const users = client.model<User & Document>("users", schema.UsersSchema);
export const course = client.model<Course & Document>("course", schema.CourseSchema);
export const courselist = client.model<CourseList & Document>(
  "courselist",
  schema.CourseListSchema
);
