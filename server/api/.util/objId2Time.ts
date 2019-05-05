import { Types } from "mongoose";
export default function ObjId2Time(_id: string | number) {
  const timestamp = Types.ObjectId(_id).getTimestamp();
  return {
    timestamp
  };
}
