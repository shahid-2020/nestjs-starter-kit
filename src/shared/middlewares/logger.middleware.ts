import * as morgan from 'morgan';

const devOutput = `":date[iso] :method :url :status :res[content-length] - :response-time ms"`;

const combinedOutput = `:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`;

export const loggerMiddleware = morgan(
  process.env.NODE_ENV !== 'development' ? combinedOutput : devOutput,
);
