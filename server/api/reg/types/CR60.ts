export interface CR60_Course {
  no: string;
  title: string;
  credit: string;
  grade: string;
}
export interface CR60 {
  period: {
    full: string;
    year: string;
    semesterth: string;
    semester: number;
  };
  detail: CR60_Course[];
  summary: {
    CA: string;
    CG: string;
    GPA: string;
    CAX: string;
    CGX: string;
    GPAX: string;
    GPX: string;
  };
}
