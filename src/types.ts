import { DataQuery } from '@grafana/data';

export type NasaNeoWsConfig = {};
export type NasaNeoWsSecureConfig = {};

export type NasaNeoWsQueryType = 'browse' | 'range';

type NasaNeoWsBaseQuery<Q extends NasaNeoWsQueryType> = { 
  queryType: Q; 
  attr: string;
  names: any[];
} & DataQuery;

type NasaNeoWsBrowseQuery = { 
  pageNum: string;
  index: string;
} & NasaNeoWsBaseQuery<'browse'>;

type NasaNeoWsRangeQuery = {
  startDate: string;
  endDate: string;
} & NasaNeoWsBaseQuery<'range'>;

export type NasaNeoWsQuery = NasaNeoWsBrowseQuery | NasaNeoWsRangeQuery;

export type NasaEndpoints = {
  browse: string;
  range: string;
};

export type NasaParams = {
  sd: string;
  ed: string;
  ak: string;
};

// CREATE TYPE FOR NEOWS
// return {
//   time: el.epoch_date_close_approach,
//   id: n.id,
//   name: n.name,
//   name_limited: n.name_limited,
//   is_potentially_hazardous_asteroid: n.is_potentially_hazardous_asteroid,
//   absolute_magnitude_h: n.absolute_magnitude_h,
//   miss_distance_km: el.miss_distance.kilometers,
//   orbiting_body: el.orbiting_body,
//   relative_velocity_kps: el.relative_velocity.kilometers_per_second
// };