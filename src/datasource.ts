import {
  DataSourceApi,
  DataSourceInstanceSettings,
  DataQueryRequest
} from '@grafana/data';

import { 
  NasaNeoWsQuery, 
  NasaNeoWsConfig 
} from './types';

export class NasaNeoWsApi extends DataSourceApi<NasaNeoWsQuery> {
  constructor(instanceSettings: DataSourceInstanceSettings<NasaNeoWsConfig>) {
    super(instanceSettings);
  }

  async query(request: DataQueryRequest<NasaNeoWsQuery>) {
    return Promise.resolve({data: []})
  }
  
  testDatasource() {
    return Promise.resolve({
      status: 'success',
      message: 'plugin working',
    })
  }
}
