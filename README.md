# Next Mongoose Session

Enables mongodb cached session for nextjs api routes and ssr pages (static and dynamic).

## Installation
```
npm i --save @eisberg-labs/next-mongoose-session
```
## Usage
In pages use like:
```
export const getStaticProps = withMongooseSessionSSR(async function () {
}, uri, options);
// or
export const getServerSideProps = withMongooseSessionSSR(async function () {

}, uri, options);
```
In api routes use like:
```
export default withMongooseSessionApiRoute(
  async function handler(req, res) {

  }
, uri, options);
```

To avoid repetition when defining mongodb uri and connect options, I suggest creating another module:
```
import * as api from '@eisberg-labs/next-mongoose-session';

const uri = process.env.MONGODB_URI
const options = {
  bufferCommands: false
}
export function withMongooseSessionSSR<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return api.withMongooseSessionSSR(handler, uri, options)
}

export async function withMongooseSessionApiRoute<T>(handler: NextApiHandler) {
  return api-withMongooseSessionApiRoute(handler, uri, options);
}
```



