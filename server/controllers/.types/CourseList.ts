export interface CourseList_info {
  code: string;
  kind: string;
  nameTH: string;
  nameEN: string;
  nameSHORT: string;
}
export interface CourseList {
  code: string;
  kind: string;
  list: any[];
  info: CourseList_info;
}
