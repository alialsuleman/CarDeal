import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";

export const verify = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header('Authorization');
    if (!auth)
        return res.status(401).send({
            success: false,
            message: 'Access denied!!!'
        })
    let token = auth.split(' ')[1];
    if (!token)
        return res.status(401).send({
            success: false,
            message: 'Access denied!!!'
        })
    try {
        const verify = jwt.verify(token, JWT_SECRET);

        res.locals.user = verify;
        res.locals.userId = res.locals.user.id as string;
        console.log("toke verfied and the userid is : " + res.locals.userId);
        next()
    } catch (err) {
        return res.status(400).send({
            success: false,
            message: 'Invalid token!!!',
        }

        )
    }
}
