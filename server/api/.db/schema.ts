import * as mongoose from "mongoose";

export const UsersSchema = new mongoose.Schema({}, { strict: false, versionKey: false });
export const CourseSchema = new mongoose.Schema({}, { strict: false, versionKey: false });
export const CourseListSchema = new mongoose.Schema({}, { strict: false, versionKey: false });
