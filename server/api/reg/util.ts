import * as _ from "lodash";

export const cartesian_product = (...rest: any[]) =>
  _.reduce(
    rest,
    (a, b) => {
      return _.flatMap(a, x => _.map(b, y => x.concat([y])));
    },
    [[]]
  );
