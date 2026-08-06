import { NextFunction, Request, Response } from "express"
import { ZodTypeAny } from "zod"

export const handleZodValidation = (schema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = await schema.parseAsync(req.body)
    next()
  } catch (error) {
    next(error)
  }
}
