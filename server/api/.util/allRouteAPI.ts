import { Express } from "express";
import * as _ from "lodash";

export default function(app: Express) {
  return _.join(
    _.sortedUniq(_.flatten(app._router.stack.map(p => Array.from(gprint([], p))))),
    "\n"
  );
}

function split(thing) {
  if (typeof thing === "string") {
    return thing.split("/");
  } else if (thing.fast_slash) {
    return "";
  } else {
    var match = thing
      .toString()
      .replace("\\/?", "")
      .replace("(?=\\/|$)", "$")
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match
      ? match[1].replace(/\\(.)/g, "$1").split("/")
      : "<complex:" + thing.toString() + ">";
  }
}

function* gprint(path: string[], layer) {
  if (layer.route) {
    for (const p of layer.route.stack) {
      yield* gprint(path.concat(split(layer.route.path)), p);
    }
  } else if (layer.name === "router" && layer.handle.stack) {
    for (const p of layer.handle.stack) {
      yield* gprint(path.concat(split(layer.regexp)), p);
    }
  } else if (layer.method) {
    const m = layer.method.toUpperCase();
    const p = path
      .concat(split(layer.regexp))
      .filter(Boolean)
      .join("/");
    yield `${m.padEnd(4)} /${p}`;
  }
}
