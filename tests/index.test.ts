import * as api from '@project/index';

describe('mongoose next session', () => {
  beforeEach(() => {
    jest.spyOn(api, 'connect').mockImplementation(async (uri, opts) => {
      return null;
    });
  });

  it('should call connect for ssr route', async () => {
    await api.withMongooseSessionSSR(
      () => {
        return {
          props: {},
        };
      },
      '',
      {}
    )();

    expect(api.connect).toHaveBeenCalledTimes(1);
  });

  it('should call connect for api route', async () => {
    // @ts-ignore
    await api.withMongooseSessionApiRoute(() => {}, '', {})(undefined, undefined);

    expect(api.connect).toHaveBeenCalledTimes(1);
  });
});
