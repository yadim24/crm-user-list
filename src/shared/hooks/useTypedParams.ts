import { Params, useParams } from 'react-router-dom';
import { ROUTE_PARAM } from '../constants';

type TypedRouteParams = (typeof ROUTE_PARAM)[keyof typeof ROUTE_PARAM];

export const useTypedRouteParams = (): Readonly<Params<TypedRouteParams>> =>
  useParams();
