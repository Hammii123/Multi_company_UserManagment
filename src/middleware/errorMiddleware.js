export function errorMiddleware(err, req , res , next) {
    console.error(err);

    if(res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Internal server error" : err.message 
    });
}