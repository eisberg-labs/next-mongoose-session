import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next';

type CachedType = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare let global: typeof globalThis & {
  cached: CachedType;
};

let cached: CachedType = global.cached;
if (!cached) {
  cached = global.cached = { conn: null, promise: null };
}

export const connect = async (uri: string, options: ConnectOptions): Promise<Mongoose | null> => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, options);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

type SSRContext = GetServerSidePropsContext | GetStaticPropsContext;
type SSRResult<P> =
  | Promise<GetStaticPropsResult<P>>
  | Promise<GetServerSidePropsResult<P>>
  | GetStaticPropsResult<P>
  | GetServerSidePropsResult<P>;

export function withMongooseSessionSSR<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context?: SSRContext) => SSRResult<P>,
  uri: string,
  options: ConnectOptions
): (context?: SSRContext) => SSRResult<P> {
  return async function nextHandler(context?: SSRContext) {
    await connect(uri, options);
    return handler(context);
  };
}

export function withMongooseSessionApiRoute<T>(
  handler: NextApiHandler<T>,
  uri: string,
  options: ConnectOptions
): NextApiHandler<T> {
  return async function nextApiHandler(req: NextApiRequest, res: NextApiResponse) {
    await connect(uri, options);
    return handler(req, res);
  };
}
