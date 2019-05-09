export interface User {
  ticket: string;
  ouid: string;
  pwid: string;
  birth: number;
  displayname: string;
  faculty: string;
  fullname: string;
  fullnameth: string;
  gender: string;
  sso: User_sso;
  year: number;
  cr60: User_cr60[];
  pinfo: User_pinfo;
  regdoc: User_regdoc;
  line: User_line;
  mbti: User_mbti;
}

export interface User_line {
  userId: string;
  channelId: string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token: string;
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  name: string;
  picture: string;
}

export interface User_mbti {
  type: string;
  type5: string;
  link: {
    th: string;
    en: string;
  };
  detail: {
    mind: {
      extraverted: string;
      introverted: string;
    };
    energy: {
      intuitive: string;
      observant: string;
    };
    nature: {
      thinking: string;
      feeling: string;
    };
    tactics: {
      judging: string;
      prospecting: string;
    };
    identity: {
      assertive: string;
      turbulent: string;
    };
  };
}

export interface User_regdoc {
  เลขนิสิตวรรค: string;
  ที่นั่งสอบ: string;
  ชื่อไทย: string;
  ชื่อสากล: string;
  เพศ: string;
  gender: string;
  วันที่รับเข้า: string;
  ระบบการศึกษา: string;
  ประเภทการรับเข้า: string;
  โครงการรับเข้า: string;
  ค่าธรรมเนียม: string;
  ประเภทการประเมินผล: string;
  ระดับการศึกษา: string;
  หลักสูตร: string;
  คณะ: string;
  ภาควิชา: string;
  สาขาวิชา: string;
  "วิชาเอก/โท": string;
  แผนการศึกษา: string;
}

export interface User_pinfo {
  ประวัติส่วนตัว: {
    เลขที่บัตรประชาชน: string;
    เลขที่พาสปอร์ต: string;
    "E-Mail Address": string;
    เพศ: string;
    "วัน เดือน ปี เกิด": string;
    ประเทศที่เกิด: string;
    สถานที่เกิด: string;
    เชื้อชาติ: string;
    สัญชาติ: string;
    ศาสนา: string;
    "ชื่อ บิดา": string;
    "ชื่อ มารดา": string;
    ผู้ปกครอง: string;
    ผู้ค้ำประกัน: string;
    gender: string;
    birthdate: string;
    birthstamp: number;
  };
  ที่อยู่ตามทะเบียนบ้าน: {
    บ้านเลขที่: string;
    หมู่ที่: string;
    "ตรอก/ซอย": string;
    อาคาร: string;
    หมู่บ้าน: string;
    ถนน: string;
    "ตำบล/แขวง": string;
    "อำเภอ/เขต": string;
    จังหวัด: string;
    รหัสไปรษณีย์: string;
    ประเทศ: string;
    โทรศัพท์: string;
  };
  ที่อยู่ปัจจุบัน: {
    บ้านเลขที่: string;
    หมู่ที่: string;
    "ตรอก/ซอย": string;
    อาคาร: string;
    หมู่บ้าน: string;
    ถนน: string;
    "ตำบล/แขวง": string;
    "อำเภอ/เขต": string;
    จังหวัด: string;
    รหัสไปรษณีย์: string;
    โทรศัพท์: string;
  };
  ที่อยู่ฉุกเฉิน: {
    ติดต่อ: string;
    เกี่ยวข้องกับนิสิต: string;
    บ้านเลขที่: string;
    หมู่ที่: string;
    "ตรอก/ซอย": string;
    อาคาร: string;
    หมู่บ้าน: string;
    ถนน: string;
    "ตำบล/แขวง": string;
    "อำเภอ/เขต": string;
    จังหวัด: string;
    รหัสไปรษณีย์: string;
    โทรศัพท์: string;
  };
  วุฒิการศึกษาที่ใช้สมัครเข้าศึกษา: {
    จบจากโรงเรียน: string;
    จังหวัดที่จบการศึกษา: string;
    วุฒิการศึกษา: string;
    วันที่สำเร็จการศึกษา: string;
  };
}

export interface User_cr60_detail {
  no: string;
  title: string;
  credit: string;
  grade: string;
}

export interface User_cr60 {
  period: {
    full: string;
    year: string;
    semesterth: string;
    semester: number;
  };
  detail: User_cr60_detail[];
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

export interface User_sso {
  gecos: string;
  email: string;
  firstname: string;
  lastname: string;
  firstnameth: string;
  lastnameth: string;
  ouid: string;
  displayname: string;
  รหัสชั้นปี: string;
  รหัสคณะ: string;
  ชั้นปี: number;
  คณะ: string;
  คณะย่อ: string;
  faculty: string;
}
