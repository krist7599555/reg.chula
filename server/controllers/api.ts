import * as Router from 'koa-router';
import mount from 'koa-mount';
import auth from './auth';
import middleware from './api.middleware';
import login from './sso/login';
import logout from './sso/logout';
import profile from './profile';
import grade from './grade';
import * as _ from 'lodash';

import * as reg from './reg';
import scape from './scaping';

// import { Middleware } from "koa/index";

const router = new Router<any, Context>();
router
  .prefix('/api')
  .use(middleware())
  .use(scape.routes())
  .use(scape.allowedMethods())
  .get('/', ctx => {
    console.log('CALL HOME');
    return ctx.ok('API');
  })
  .post('/login', login)
  .get('/logout', logout)
  .get('/profile', profile)
  // .get("/user/:ouid/profile", profile)
  // .get("/user/:ouid", ctx => ctx.ok(ctx.params.ouid))
  .get('/user/adminLogout', reg.adminLogout)
  .get('/user/adminCookie', reg.adminCookie)
  .get('/user/multi.json', reg.multi)
  .get('/user/:ouid/grade', grade)
  .get('/user/:ouid.pdf', reg.pdf)
  .get('/user/:ouid.json', reg.json)
  .get('/user/offline/:ouid.json', reg.json_offline)
  .get('/user/:ouid/cr54', reg.cr54)
  .get('/course', ctx => ctx.ok('please specific ID'))
  .get('/course/:id', async ctx => {
    console.log('ID', ctx.params);
    const allrecords = await ctx.grade.find({ courseID: ctx.params.id }).toArray();
    if (allrecords.length == 0) {
      return ctx.noContent();
    } else {
      const base = allrecords[0];
      const grp = _.groupBy(allrecords, ['year', 'semester']);
      return ctx.ok({
        courseID: base.courseID,
        courseABBR: base.courseABBR,
        credit: base.credit,
        summary: grp
      });
    }
  });
// .get("/course/:id"); // course {head, list}

// .use(auth.routes())
// .use(auth.allowedMethods())
// .use(reg.routes())
// .use(reg.allowedMethods());
// router.prefix("/api").use(mount("/auth", auth));

export default router;
