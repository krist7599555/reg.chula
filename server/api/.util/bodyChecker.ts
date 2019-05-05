import { check, param, cookie, query } from "express-validator/check";
import { validationResult } from "express-validator/check";
import { Request, Response, NextFunction } from "express";

export function expressValidatorAssert(code: number = 400) {
  return function(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(code).json({ errors: errors.array() });
    } else {
      next();
    }
  };
}
export { check, param, cookie, query, validationResult };
