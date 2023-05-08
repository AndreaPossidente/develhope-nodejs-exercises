import type { Request, Response, NextFunction } from "express";
import passport from "passport";

const authorize = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (error: any, user: any) => {
    if (!user || error) {
      res.status(401).json({ msg: "Unauthorized" });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

export default authorize;
