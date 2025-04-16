export const errorHandler = (error, req, res, next) => {
    const { status = 500, message = 'Sarver error' } = error;
    res.status(status).json({
      message,
    });
  };