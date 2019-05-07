async function test_chunk() {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const s = new Readable();
  s._read = function() {};
  s.pipe(ctx.res);
  try {
    ctx.res.writeHead(200);
    // setTimeout(async () => {
    console.log("call");
    await sleep(1000);
    s.push("<Hello>");
    console.log(1);
    await sleep(1000);
    s.push("<Hello>");
    console.log(2);
    await sleep(1000);
    s.push("<Hello>");
    console.log(3);
    await sleep(1000);
    s.push(null);
    s.emit("end");
    console.log("end");
    // }, 1000);
  } catch {
    throw new Error("SOME ERROR");
  }
  return;
  // try {
  //   ctx.res.writeHead(200);
  //   // setTimeout(async () => {
  //   console.log("call");
  //   await sleep(1000);
  //   ctx.res.write("<Hello>");
  //   console.log(1);
  //   await sleep(1000);
  //   ctx.res.write("<Hello>");
  //   console.log(2);
  //   await sleep(1000);
  //   ctx.res.write("<Hello>");
  //   console.log(3);
  //   await sleep(1000);
  //   ctx.res.end();
  //   console.log("end");
  //   // }, 1000);
  // } catch {
  //   throw new Error("SOME ERROR");
  // }
}
