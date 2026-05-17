import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.type === "field" ? e.path : "unknown",
      message: e.msg,
    }));
    return res
      .status(400)
      .json({ success: false, message: "Validation Error", errors: formatted });
    return;
  }

  next();
};
