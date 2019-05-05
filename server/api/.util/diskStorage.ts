import * as fs from "fs";
import * as _ from "lodash";

export default class {
  filename = "";
  cache = null;

  constructor(filename, dir: string = __dirname) {
    this.filename = dir + "/" + filename;
    this.cache = this.all();
  }

  _read() {
    return fs.readFileSync(this.filename).toString("utf-8");
  }
  _write(s: any) {
    return fs.writeFileSync(this.filename, s);
  }

  all(): any {
    if (this.cache != null) return this.cache;
    try {
      return (this.cache = JSON.parse(this._read()));
    } catch (e) {
      return (this.cache = {});
    }
  }
  get(key: string | number) {
    return _.get(this.all(), key, null);
  }
  set(key: string | number, val: any) {
    this.cache = _.assign(this.all(), { [String(key)]: val });
    this._write(JSON.stringify(this.cache));
  }
  remove(key: string | number) {
    if (key in this.all()) {
      delete this.cache[key];
      this._write(JSON.stringify(this.cache));
    }
  }
}
