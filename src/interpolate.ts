import { NasaNeoWsQuery, NasaNeoWsVariableQuery } from 'types';
import { getTemplateSrv } from '@grafana/runtime';

export const interpolateQuery = (query: NasaNeoWsQuery): NasaNeoWsQuery => {
  if (query.queryType === 'browse') {
    return {
      ...query,
      page: getTemplateSrv().replace(query.page || '0'),
      name: getTemplateSrv().replace(query.name || ''),
      hazardous: getTemplateSrv().replace(query.hazardous || 'none'),
      orbitingBody: getTemplateSrv().replace(query.orbitingBody || ''),
    };
  }
  return query;
}

export const interpolateVariableQuery = (query: NasaNeoWsVariableQuery): NasaNeoWsVariableQuery => {
  switch (query.queryType) {
    case 'name':
      return {
        ...query,
        page: getTemplateSrv().replace(query.page || '0'),
        hazardous: getTemplateSrv().replace(query.hazardous || ''),
        orbitingBody: getTemplateSrv().replace(query.orbitingBody || ''),
      }
    case 'hazardous':
      return {
        ...query,
        page: getTemplateSrv().replace(query.page || ''),
      }
    case 'orbitingBody':
      return {
        ...query,
        page: getTemplateSrv().replace(query.page || ''),
      }
  }
  
  return query;
}