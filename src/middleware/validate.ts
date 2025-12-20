
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod"

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    next();
  } catch (err:unknown) {
    if (err instanceof ZodError) {
      res.status(400).json({ message: "validation Error ",errors:err.issues });

    }
    next(err)
  }
};
