const errorMiddleware =  (error,req,resp,next) =>{
    const status = error.status || 500;
    const message = error.message || "Backend Error";
    const extraDetails = error.extraDetails || "Backend Error";

    return resp.status(status).json({message,extraDetails})
};

module.exports =  errorMiddleware