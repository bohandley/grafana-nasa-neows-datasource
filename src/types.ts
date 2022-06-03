import { DataQuery } from '@grafana/data';

export type NasaNeoWsConfig = {};
export type NasaNeoWsSecureConfig = {};

export type NasaNeoWsQueryType = 'browse' | 'range';
export type HazardousQueryType = 'true' | 'false' | 'none' | '$hazardous';
export type NasaNeoWsAnnotationType = string;//'names' | 'size' | 'velocity' | 'hazardous';

// QUERY
export interface NasaNeoWsBaseQuery<Q extends NasaNeoWsQueryType> extends DataQuery { 
  queryType: Q; 
  attr: string;
  names: any[];
  name: string;
  hazardous: string;
  orbitingBody: string;
  eventsQuery?: NasaNeoWsEventsQuery;
};

export type NasaNeoWsEventsQuery = {
  fromAnnotations?: boolean;
  names?: string[];
  size?: string;
  velocity?: string;
  hazardous?: string;
};

type NasaNeoWsBrowseQuery = { 
  page: string;
  index: string;
} & NasaNeoWsBaseQuery<'browse'>;

type NasaNeoWsRangeQuery = {
  startDate: string;
  endDate?: string;
} & NasaNeoWsBaseQuery<'range'>;

export type NasaNeoWsQuery = NasaNeoWsBrowseQuery | NasaNeoWsRangeQuery;

// VARIABLE QUERY
export type VariableQueryType = 'page' | 'name' | 'hazardous' | 'orbitingBody';

type VariableQueryTypeName = { 
  queryType: 'name'; 
  page?: string;
  hazardous?: string; 
  orbitingBody?: string 
};
type VariableQueryTypeHazardous = { 
  queryType: 'hazardous'; 
  page?: string 
};
type VariableQueryTypeOrbitingBody = { 
  queryType: 'orbitingBody';
  page?: string 
};
type VariableQueryTypePage = { queryType: 'page'; };

export type NasaNeoWsVariableQuery = 
  | VariableQueryTypeName
  | VariableQueryTypeHazardous
  | VariableQueryTypeOrbitingBody
  | VariableQueryTypePage;

export type NasaEndpoints = {
  browse: string;
  range: string;
};

export type NasaParams = {
  sd: string;
  ed: string;
  ak: string;
};

// for data frames 
export type frameType = {
  name: string;
  fields: fieldType[];
}

export type fieldType = {
  name: string;
  values: any[];
  X?: string
}

// CREATE TYPE FOR Near Earth Objects
export type NearEarthObject = {
  links: {
    //simpified and not used currently
  };
  id: string;
  neo_reference_id: string;
  name: string;
  name_limited: string;
  designation: string;
  nasa_jpl_url: string
  absolute_magnitude_h: string;
  estimated_diameter: estimatedDiameter; 
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachData[];
  orbital_data: OrbitalData;
  is_sentry_object: boolean;
}

export type estimatedDiameter = {
  kilometers: {
      estimated_diameter_min: string;
      estimated_diameter_max: string;
  },
  meters: {
      estimated_diameter_min: string;
      estimated_diameter_max: string;
  },
  miles: {
      estimated_diameter_min: string;
      estimated_diameter_max: string;
  },
  feet: {
      estimated_diameter_min: string;
      estimated_diameter_max: string;
  }
};

export type CloseApproachData = {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    //simpified
    kilometers_per_second: string;
  };      
  miss_distance: {
    //simpified
    kilometers: string;
  };
  orbiting_body: string;
};

export type OrbitalData = {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
  equinox: string;
  orbit_class: {
    //simpified, not used currently
  };
};

