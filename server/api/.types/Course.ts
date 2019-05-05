export interface Course_schedule_record {
  ตอนเรียน: string;
  วิธีสอน: string;
  วันเรียน: string;
  เวลาเรียน: string;
  อาคาร: string;
  ห้อง: string;
  ผู้สอน: string;
  หมายเหตุ: string;
  จำนวนนิสิต: string;
  ลงทะเบียน: number;
  ที่นั้งทั้งหมด: number;
  เวลาเริ่ม: string;
  เวลาจบ: string;
}
export interface Course {
  course: string;
  yeartime: string;
  group: string;
  courseName: {
    id: string;
    nameEN: string;
    nameTH: string;
    nameSHORT: string;
  };
  create: number;
  faculty: string;
  credit: string;
  creditDetail: {
    credit: string;
    hour: string;
  };
  prerequisite: string;
  exam: {
    midterm: string;
    final: string;
  };
  schedule: {
    table: string[][];
    record: {
      [section: string]: Course_schedule_record;
    };
    genedSection: number[];
  };
  gened: {
    code: string;
    nameTH: string;
    nameEN: string;
    nameSHORT: string;
  };
}
