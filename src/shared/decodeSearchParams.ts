type DecodedSearchParams = Record<string, string | string[]>;

export const decodeSearchParams = (
  searchParams: URLSearchParams,
): DecodedSearchParams => {
  const initialValue: DecodedSearchParams = {};

  return Array.from(searchParams).reduce((acc, [key, value]) => {
    const prevValue = acc[key];

    if (prevValue) {
      const nextValue = Array.isArray(prevValue)
        ? [...prevValue, value]
        : [prevValue, value];

      return {
        ...acc,
        [key]: nextValue,
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, initialValue);
};
