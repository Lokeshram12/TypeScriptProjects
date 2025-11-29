export class NotFoundError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 400;
    }
}
export function errorHandler(err, req, res, next) {
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong on our end";
    res.status(statusCode).json({
        "error": message
    });
}
