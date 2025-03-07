import {
  Functions,
  httpsCallable,
  HttpsCallableOptions,
  HttpsCallableResult,
} from 'firebase/functions';
import { useCallback, useState } from 'react';

export type HttpsCallableHook<
  RequestData = unknown,
  ResponseData = unknown
> = Readonly<
  [
    (
      data?: RequestData
    ) => Promise<HttpsCallableResult<ResponseData> | undefined>,
    boolean,
    Error | undefined
  ]
>;

export default <RequestData = unknown, ResponseData = unknown>(
  functions: Functions,
  name: string,
  options?: HttpsCallableOptions,
): HttpsCallableHook<RequestData, ResponseData> => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const callCallable = useCallback(
    async (
      data?: RequestData
    ): Promise<HttpsCallableResult<ResponseData> | undefined> => {
      const callable = httpsCallable<RequestData, ResponseData>(
        functions,
        name,
        options,
      );
      setLoading(true);
      setError(undefined);
      try {
        return await callable(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [functions, name, options]
  );

  return [callCallable, loading, error] as const;
};
