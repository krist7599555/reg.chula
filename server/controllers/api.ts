import * as Router from 'koa-router';
import mount from 'koa-mount';
import auth from './auth';
import middleware from './api.middleware';
import login from './sso/login';
import logout from './sso/logout';
import profile from './profile';
import { gradeByOuid, gradeByCourseID } from './grade';
import { courses, courses_courseID } from './courses';
import { comments_create, comments_download } from './comments';
import * as _ from 'lodash';

import * as reg from './reg';
import scape from './scaping';

// import { Middleware } from "koa/index";

const router = new Router<any, Context>();
router
  .prefix('/api')
  .get('/before', ctx => (ctx.body = 'before middleware'))
  .use(middleware())
  .get('/after', ctx => (ctx.body = 'after middleware'))
  .use(scape.routes())
  .use(scape.allowedMethods())
  .get('/', ctx => {
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
  .get('/user/:ouid/grade', gradeByOuid)
  .get('/user/:ouid.pdf', reg.pdf)
  .get('/user/:ouid.json', reg.json)
  .get('/user/offline/:ouid.json', reg.json_offline)
  .get('/user/:ouid/cr54', reg.cr54)
  .get('/courses', courses)
  .get('/courses/:courseID', courses_courseID)
  .get('/grades/:courseID', gradeByCourseID)
  .get('/posts/:id', comments_download)
  .post('/posts/:parant', comments_create)
  .patch('/posts/:id');
// .get("/course/:id"); // course {head, list}

// .use(auth.routes())
// .use(auth.allowedMethods())
// .use(reg.routes())
// .use(reg.allowedMethods());
// router.prefix("/api").use(mount("/auth", auth));

export default router;
