import {
  DataSourceApi,
  DataSourceInstanceSettings,
  DataQueryRequest,
  MutableDataFrame
} from '@grafana/data';

import { 
  NasaNeoWsQuery, 
  NasaNeoWsConfig,
  NasaEndpoints,
  NasaParams
} from './types';

export class NasaNeoWsApi extends DataSourceApi<NasaNeoWsQuery> {
  constructor(instanceSettings: DataSourceInstanceSettings<NasaNeoWsConfig>) {
    super(instanceSettings);
  }

  async query(request: DataQueryRequest<NasaNeoWsQuery>) {
    if (request.targets && request.targets.length > 0) {
      let actualQuery = request.targets[0];
      const nasaBaseUrl = 'https://api.nasa.gov/neo/rest/v1/';
      // move this into config editor
      const apiKey = 'yAyH8cJEzor6tU5Kl6iLxnNnqLunMUq9jpy9rES4';
      
      const endpoints: NasaEndpoints = {
        browse: 'neo/browse?',
        feed: 'feed?'
      };

      const params: NasaParams = {
        sd: 'start_date=',
        ed: 'end_date=',
        ak: 'api_key='
      };

      // 1. choose either browse or range
        // https://api.nasa.gov/neo/rest/v1/neo/browse?
          // rename designation to name_limited
          // choose a page
          // filter by absolute_magnitude_h, miss_distance and relative_velocity
        // https://api.nasa.gov/neo/rest/v1/feed?
          // build this out!
      switch (actualQuery.queryType) {
        case 'browse':
          const actualPageNum = actualQuery.pageNum || '0';
          const actualIndex = actualQuery.index || 'all';
          let url = `${nasaBaseUrl}${endpoints['browse']}${params['ak']}${apiKey}&page=${actualPageNum}`
          const result = await fetch(url)
            .then((res) => res.json())
            .then((res) => {
              const neows: any[] = res?.near_earth_objects || [];
              
              // build a collection of neows
              let neowsWithTime: any[] = neows.reduce((acc,n,idx) => {
                let times: any[] = [];
                let attrs: any[] = [];

                if (n.close_approach_data.length > 0){
                  n.close_approach_data.map((el: any) => {

                    times.push(el.epoch_date_close_approach);
                    // set the other attr based on selected attr
                    switch (actualQuery.attr) {
                      case ('relative_velocity'):
                        attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
                      case 'absolute_magnitude_h':
                        attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
                      case 'miss_distance_km':
                        attrs.push(parseFloat(el.miss_distance.kilometers));
                      default:
                        attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
                    }
                  });
                  // when using toDataFrame, changing the attr just adds it to the dataframe
                  // but if we instantiate a new mutable dataframe every time, we don;t get the busy view with all the labels
                  // we just get one label
                  let frame = new MutableDataFrame({
                    name: n.name_limited,
                    fields: [
                      {
                        name: 'time',
                        values: times,
                      },
                      {
                        name: n.name_limited,
                        values: attrs,
                      }
                    ],
                  });

                  return acc.concat(frame)
                }

                return acc;
                
              }, [])

              // filter for a selected index
              if (actualIndex != 'all') {
                neowsWithTime = neowsWithTime.filter((el:any, idx) => idx === +actualIndex);       
              }

              return neowsWithTime;
            });
            
          // return Promise.resolve({data: [result]});
          return Promise.resolve({data: result});
        case 'range':

      }
      
      
      

      

      
      

      
      
    }

    return Promise.resolve({data: []});
  }

  testDatasource() {
    return Promise.resolve({
      status: 'success',
      message: 'plugin working',
    })
  }
}
