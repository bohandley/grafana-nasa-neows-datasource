import {
  DataSourceApi,
  DataSourceInstanceSettings,
  DataQueryRequest,
  MutableDataFrame,
  MetricFindValue,
  toDataFrame
} from '@grafana/data';

import { hasKey } from 'helpers';

import { 
  NasaNeoWsQuery, 
  NasaNeoWsConfig,
  NasaEndpoints,
  NasaParams,
  NasaNeoWsVariableQuery,
  NearEarthObject,
  CloseApproachData,
  NasaNeoWsEventsQuery,
  NasaNeoWsAnnotationType,
  frameType,
} from './types';
import { AnnotationEditor } from './components/AnnotationEditor';

import { interpolateQuery, interpolateVariableQuery } from 'interpolate';

export class NasaNeoWsApi extends DataSourceApi<NasaNeoWsQuery> {
  previousQuery = {};
  apiKey: string = 'yAyH8cJEzor6tU5Kl6iLxnNnqLunMUq9jpy9rES4';
  nasaBaseUrl: string = 'https://api.nasa.gov/neo/rest/v1/';
  endpoints: NasaEndpoints = {
    browse: 'neo/browse?',
    range: 'feed?'
  };
  params: NasaParams = {
    sd: 'start_date=',
    ed: 'end_date=',
    ak: 'api_key='
  };
  // list of names could be used in select
  names: string[] = [];

  constructor(instanceSettings: DataSourceInstanceSettings<NasaNeoWsConfig>) {
    super(instanceSettings);
    this.annotations = {
      QueryEditor: AnnotationEditor,
    };
  }

  async query(request: DataQueryRequest<NasaNeoWsQuery>) {
    // annotations
    if(request.targets[0].eventsQuery) {
      return this.getAnnotations(request, this.previousQuery);
    }
    
    // queries
    if (request.targets && request.targets.length > 0) {
      this.previousQuery = request.targets[0];
      return this.getNeos(request)
    }

    return Promise.resolve({data: []});
  }

  async metricFindQuery(query: NasaNeoWsVariableQuery): Promise<MetricFindValue[]> {
    const nasaBaseUrl = this.nasaBaseUrl + this.endpoints['browse'];
    // move this into config editor
    const apiKey = this.apiKey;
    let interpolatedQuery = interpolateVariableQuery(query);
    const queryType = interpolatedQuery.queryType;
    
    let interpolatePage = '0';

    if (queryType !== 'page')
      interpolatePage = interpolatedQuery.page ? interpolatedQuery.page : '0';

    let url = `${nasaBaseUrl}api_key=${apiKey}&page=${interpolatePage}`
    const results = await fetch(url)
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
    
    const pageNeows = results.near_earth_objects;

    const pages = results.page.total_pages;

    const noneStart: any[] = [{text: 'n/a', value: ''}];

    switch (queryType) {
      case 'page':
        const listOfPages = [...Array(pages-1).keys()]
        .map(el => {
          return {text: ''+el, value: ''+el}
        })

        return Promise.resolve(
          listOfPages
        );
      case 'hazardous':
        return Promise.resolve(
          [
            {text: 'n/a', value: ''},
            {text: 'true', value: 'true'},
            {text: 'false', value: 'false'}
          ]
        );
      case 'orbitingBody':
        const orbitingBodies = noneStart.concat(pageNeows.map((el: any) => {
          return {text: el.close_approach_data[0].orbiting_body, value: el.close_approach_data[0].orbiting_body}
        }).flat());

        return Promise.resolve(orbitingBodies);
      case 'name':
        
        if(interpolatedQuery.hazardous && interpolatedQuery.orbitingBody) {
          const hazardous = interpolatedQuery.hazardous;
          const orbitingBody = interpolatedQuery.orbitingBody;

          const hazBodies = noneStart.concat(pageNeows.filter((el:NearEarthObject) => {
            return (
              ''+el.is_potentially_hazardous_asteroid === hazardous
              && el.close_approach_data[0].orbiting_body === orbitingBody
            )
          })
          .map((n: any) => {
            return { text: ''+n.name, value: ''+n.name }
          }));

          return Promise.resolve(hazBodies);

        } else if (interpolatedQuery.hazardous) {
          const hazardous = interpolatedQuery.hazardous;

          const haz = noneStart.concat(pageNeows.filter((el:NearEarthObject) => {
            return (
              ''+el.is_potentially_hazardous_asteroid === hazardous
            )
          })
          .map((n: any) => {
            return { text: ''+n.name, value: ''+n.name }
          }));

          return Promise.resolve(haz);

        } else if (interpolatedQuery.orbitingBody) {
          const orbitingBody = interpolatedQuery.orbitingBody;

          const bodies = noneStart.concat(pageNeows.filter((el:NearEarthObject) => {
            return (
              el.close_approach_data[0].orbiting_body === orbitingBody
            )
          })
          .map((n: any) => {
            return { text: ''+n.name, value: ''+n.name }
          }));

          return Promise.resolve(bodies);

        } else {
          const all = noneStart.concat(pageNeows.map((n: any) => {
            return { text: ''+n.name, value: ''+n.name }
          }));

          return Promise.resolve(all)
        }
    }
    return [];
  }

  testDatasource() {
    return Promise.resolve({
      status: 'success',
      message: 'plugin working',
    })
  }

  private async getNeos(request:any) {
    // interpolate the query and replace attrs with template variables, i.e. $orbitingBody
    let actualQuery = interpolateQuery(request.targets[0]);
  
    // move this into config editor
    const apiKey = this.apiKey;

    // used for the selections, assign this.names, access in browseNames in future
    let names: any[] = [];

    // 1. choose either browse or range
      // https://api.nasa.gov/neo/rest/v1/neo/browse?
        // rename designation to name_limited
        // choose a page
        // filter by absolute_magnitude_h, miss_distance and relative_velocity
      // https://api.nasa.gov/neo/rest/v1/feed?
        // build this out!
        // select an attr
        // select a date, returns the date + one week
        // FUTURE WORK: select for a single day
    switch (actualQuery.queryType) {
      case 'browse':
        const actualPage = actualQuery.page || '0';
        const actualName = actualQuery.name || '';
        const actualHazardous = actualQuery.hazardous || '';
        const actualOrbitingBody = actualQuery.orbitingBody || '';
        const actualAttr = actualQuery.attr || 'relative_velocity_kps';
        
        let browseUrl = `${this.nasaBaseUrl}${this.endpoints['browse']}${this.params['ak']}${apiKey}&page=${actualPage}`;

        const result = await fetch(browseUrl)
          .then((res) => res.json())
          .then((res) => {
            let neows: any[] = res?.near_earth_objects || [];
            
            // FILTERING
            // filter for a selected hazardous boolean
            if (actualHazardous && actualHazardous !== 'none') {
              neows = neows.filter((el:any, idx) => actualHazardous === ''+el.is_potentially_hazardous_asteroid);       
            }
            // filter for a selected orbiting body
            if (actualOrbitingBody && actualOrbitingBody !== 'none') {
              neows = neows.filter((el:any, idx) => actualOrbitingBody === el.close_approach_data[0].orbiting_body);       
            }
            // filter for names of near earth objects
            if (actualName && actualName !== 'none') {
              neows = neows.filter((el:any, idx) => actualName === el.name);       
            }
            // build a collection of neows
            let neowsWithTime; 
            let browseName:string;
            
            // handle single variable elements with bar charts like absolute magnitude
            // if (actualAttr === 'relative_velocity_kps' || actualAttr === 'miss_distance_km') {
              neowsWithTime = neows.reduce((acc, n: NearEarthObject,idx: number) => {
                browseName = n.name_limited ? n.name_limited : n.name;

                let times: number[] = [];
                let attrs: number[] = [];

                if (n.close_approach_data.length > 0){
                  // iterate through all the approaches an asteroid has to earth
                  n.close_approach_data.map((el: CloseApproachData) => {

                    times.push(el.epoch_date_close_approach);
                    // set the other attr based on selected attr
                    switch (actualAttr) {
                      case 'relative_velocity_kps':
                        attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
                        break;
                      case 'absolute_magnitude_h':
                        attrs.push(parseFloat(n.absolute_magnitude_h));
                        break;
                      case 'miss_distance_km':
                        attrs.push(parseFloat(el.miss_distance.kilometers));
                        break;
                      case 'estimated_diameter':
                        attrs.push(parseFloat(n.estimated_diameter.kilometers.estimated_diameter_max));
                        break;
                    }
                  });

                  // build the list of names for the select
                  names.push(n.name_limited)

                  // when using toDataFrame, changing the attr just adds it to the dataframe
                  // but if we instantiate a new mutable dataframe every time, we don't get the busy view with all the labels
                  // we just get one label
                  let frame: frameType = {
                    name: ''+idx,
                    fields: [
                      {
                        name: 'time',
                        values: times,
                      },
                      {
                        name: browseName,
                        values: attrs,
                      }
                    ],
                  };

                  if (actualAttr === 'absolute_magnitude_h' || actualAttr === 'estimated_diameter'){
                    frame.fields.filter((el) => el.name != 'time')[0] = {...frame.fields.filter((el) => el.name != 'time')[0], X: browseName};
                  }
                    
                  return acc.concat([new MutableDataFrame(frame)]);
                } 

                return acc;
              }, [])
            // ALTERNATE WAY OF HANDLING STATIC ATTRS
            // } else {
              // let title: string = 'Absolute Magnitude';

            //   let names: any[] = [];
            //   let values: any[] = [];
            //   // let frms: any[] = []
            //   neowsWithTime = neows.map((n: NearEarthObject,idx: number) => {
            //     browseName = n.name_limited ? n.name_limited : n.name;
            //     names.push(browseName);
            //     values.push(parseFloat(n.absolute_magnitude_h));
            //     return {
            //       X: browseName,
            //       value: parseFloat(n.absolute_magnitude_h),
            //       color: 'blue'
            //     };
            //   });

            //   // return [toDataFrame({
            //   //   name: title,
            //   //   fields: [
            //   //     { name: 'x', values: names },
            //   //     { name: 'value', values: values}
            //   //   ]
            //   // })];
            //   return [toDataFrame(neowsWithTime)]
            // }
            // how to update something in the query editor based on data passed in from the query
            actualQuery.names = names;

            return neowsWithTime;
          });
          
        return Promise.resolve({data: result});
      case 'range':
        const actualStartDate = actualQuery.startDate ? actualQuery.startDate : new Date().toISOString().substring(0, 10);

        // HANDLE LESS THAN A WEEK BY PROVIDING AN END DATE
        // const actualEndDate = actualQuery.endDate ? actualQuery.endDate : actualStartDate;

        let rangeUrl = `${this.nasaBaseUrl}${this.endpoints['range']}${this.params['ak']}${apiKey}&${this.params['sd']}${actualStartDate}`

        // FUTURE DEVELOPMENT?
        // use a radio button group to selet either a single day or a week
        // when selecting a single day, have the startDate === endDate
        // rangeUrl += actualEndDate ? `&${params['ed']}${actualEndDate}` : '';
        const rangeResult = await fetch(rangeUrl)
          .then((res) => res.json())
          .then((res) => {
            const neows = res?.near_earth_objects || {};
            const neowsDates: any[] = Object.keys(res?.near_earth_objects) || [];
            
            // build a collection of neows first by days
            let neowsWithTime: any[] = neowsDates.reduce((acc,kDate,idx) => {
              // collection of asteroids for each date
              const dayOfNeows = neows[kDate];

              let times: any[] = [];
              let attrs: any[] = [];
              let frames: any[] = [];
              //collection of asteroids
              dayOfNeows.forEach((n: any) => {
                if (n.close_approach_data.length > 0) {
                  // iterate through all the approaches an asteroid has to earth
                  n.close_approach_data.map((el: any) => {

                    times.push(el.epoch_date_close_approach);
                    // set the other attr based on selected attr
                    switch (actualQuery.attr) {
                      case ('relative_velocity_kps'):
                        attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
                        break;
                      case 'absolute_magnitude_h':
                        attrs.push(parseFloat(n.absolute_magnitude_h));
                        break;
                      case 'miss_distance_km':
                        attrs.push(parseFloat(el.miss_distance.kilometers));
                        break;
                    }
                  });

                  // when using toDataFrame, changing the attr just adds it to the dataframe
                  // but if we instantiate a new mutable dataframe every time, we don;t get the busy view with all the labels
                  // we just get one label
                  const rangeName :string = n.name_limited ? n.name_limited : n.name;

                  let frame = new MutableDataFrame({
                    name: kDate,
                    fields: [
                      {
                        name: 'time',
                        values: times,
                      },
                      {
                        name: rangeName,
                        values: attrs,
                      }
                    ],
                  });
                  
                  frames.push(frame);  
                }
              });
                
              return acc.concat(frames)
            }, [])

            // how to update something in the query editor based on data passed in from the query
            // actualQuery.names = names;

            return neowsWithTime;
          });
          
        return Promise.resolve({data: rangeResult});

      default:
        return Promise.resolve({data: []});

    }
  }

  private async getAnnotations(request:DataQueryRequest<NasaNeoWsQuery>, previousQuery: any) {
    const timeFrom = Math.floor(request.range.from.valueOf());// / 1000);
    const timeTo = Math.floor(request.range.to.valueOf());// / 1000);

    const eventsQuery: NasaNeoWsEventsQuery = request.targets[0].eventsQuery || {};

    const annotationType: NasaNeoWsAnnotationType = Object.keys(eventsQuery)[0];

    let annotationValue: string | any [] | boolean | undefined;
    
    if (hasKey(eventsQuery, annotationType)) {
      annotationValue = eventsQuery[annotationType];
    }
      
    let actualQuery = interpolateQuery(previousQuery);

    // used for the selections
    let names: any[] = [];

    // 1. choose either browse or range
      // https://api.nasa.gov/neo/rest/v1/neo/browse?
        // rename designation to name_limited
        // choose a page
        // filter by absolute_magnitude_h, miss_distance and relative_velocity
      // https://api.nasa.gov/neo/rest/v1/feed?
        // build this out!
        // select an attr
        // select a date, returns the date + one week
        // FUTURE WORK: select for a single day
    switch (actualQuery.queryType) {
      case 'browse':
        const actualPage = actualQuery.page || '0';
        const actualName = actualQuery.name || '';
        const actualHazardous = actualQuery.hazardous || '';
        const actualOrbitingBody = actualQuery.orbitingBody || '';
        // const actualAttr = actualQuery.attr || 'relative_velocity_kps';
        
        let browseUrl = `${this.nasaBaseUrl}${this.endpoints['browse']}${this.params['ak']}${this.apiKey}&page=${actualPage}`
        const result = await fetch(browseUrl)
          .then((res) => res.json())
          .then((res) => {
            let neows: any[] = res?.near_earth_objects || [];
            
            // TEMPLATE FILTERING
            // filter for a selected hazardous boolean
            if (actualHazardous && actualHazardous !== 'none') {
              neows = neows.filter((el:any, idx) => actualHazardous === ''+el.is_potentially_hazardous_asteroid);       
            }
            // filter for a selected orbiting body
            if (actualOrbitingBody && actualOrbitingBody !== 'none') {
              neows = neows.filter((el:any, idx) => actualOrbitingBody === el.close_approach_data[0].orbiting_body);       
            }
            if (actualName && actualName !== 'none') {
              neows = neows.filter((el:any, idx) => actualName === el.name);       
            }


            // Annotation filtering
            if (annotationType == 'names') {
              Promise.resolve({data: []});
            } else if (annotationType == 'hazardous') {
              neows = neows.filter((el:any, idx) => annotationValue === ''+el.is_potentially_hazardous_asteroid);
            } else if (annotationType == 'velocity') {
              Promise.resolve({data: []});
            } else if (annotationType == 'size') {
              Promise.resolve({data: []});
            }

            // we just need the time and the name
            // build a collection of neows
            let annotationEvents: any[] = neows.reduce((acc, n: NearEarthObject,idx: number) => {
              let times: any[] = [];
              // let attrs: number[] = [];

              if (n.close_approach_data.length > 0){
                // iterate through all the approaches an asteroid has to earth
                n.close_approach_data.map((el: CloseApproachData) => {
                  const epochTime = el.epoch_date_close_approach;
                  const browseName :string = n.name_limited ? n.name_limited : n.name;
                  if (timeFrom < epochTime && epochTime < timeTo) {
                    times.push({
                      time: new Date(el.epoch_date_close_approach), 
                      title: browseName, 
                      text: 'Is potentially hazardous',
                      // tags: annotationType,
                    });
                  }
                });

                // build the list of names for the select
                names.push(n.name_limited)

                return acc.concat(toDataFrame(times))
              }

              return acc;
            }, [])

            return annotationEvents;
          });
          
        return Promise.resolve({data: result});
      
      // BUILD OUT RANGE ANNOTATIONS BELOW
      // case 'range':
      //   const actualStartDate = actualQuery.startDate ? actualQuery.startDate : new Date().toISOString().substring(0, 10);
      //   // const actualEndDate = actualQuery.endDate ? actualQuery.endDate : actualStartDate;

      //   let rangeUrl = `${this.nasaBaseUrl}${this.endpoints['range']}${this.params['ak']}${this.apiKey}&${this.params['sd']}${actualStartDate}`

      //   // use a radio button group to selet either a single day or a week
      //   // when selecting a single day, have the startDate === endDate
      //   // rangeUrl += actualEndDate ? `&${params['ed']}${actualEndDate}` : '';
      //   const rangeResult = await fetch(rangeUrl)
      //     .then((res) => res.json())
      //     .then((res) => {
      //       const neows = res?.near_earth_objects || {};
      //       const neowsDates: any[] = Object.keys(res?.near_earth_objects) || [];
            
      //       // build a collection of neows first by days
      //       let neowsWithTime: any[] = neowsDates.reduce((acc,kDate,idx) => {
      //         // collection of asteroids for each date
      //         const dayOfNeows = neows[kDate];

      //         let times: any[] = [];
      //         let attrs: any[] = [];
      //         let frames: any[] = [];
      //         //collection of asteroids
      //         dayOfNeows.forEach((n: any) => {

              
      //           if (n.close_approach_data.length > 0) {
      //             // iterate through all the approaches an asteroid has to earth
      //             n.close_approach_data.map((el: any) => {

      //               times.push(el.epoch_date_close_approach);
      //               // set the other attr based on selected attr
      //               switch (actualQuery.attr) {
      //                 case ('relative_velocity_kps'):
      //                   attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
      //                   break;
      //                 case 'absolute_magnitude_h':
      //                   attrs.push(parseFloat(n.absolute_magnitude_h));
      //                   break;
      //                 case 'miss_distance_km':
      //                   attrs.push(parseFloat(el.miss_distance.kilometers));
      //                   break;
      //                 // default:
      //                 //   attrs.push(parseFloat(el.relative_velocity.kilometers_per_second));
      //               }
      //             });

      //             // build the list of names for the select
      //             names.push(n.name)

      //             // when using toDataFrame, changing the attr just adds it to the dataframe
      //             // but if we instantiate a new mutable dataframe every time, we don;t get the busy view with all the labels
      //             // we just get one label
      //             const rangeName :string = n.name_limited ? n.name_limited : n.name;

      //             let frame = new MutableDataFrame({
      //               name: kDate,
      //               fields: [
      //                 {
      //                   name: 'time',
      //                   values: times,
      //                 },
      //                 {
      //                   name: rangeName,
      //                   values: attrs,
      //                 }
      //               ],
      //             });
                  
      //             frames.push(frame);  
      //           }
      //         });
                
      //         return acc.concat(frames)
      //       }, [])

      //       // how to update something in the query editor based on data passed in from the query
      //       // actualQuery.names = names;

      //       return neowsWithTime;
      //     });
          
      //   return Promise.resolve({data: rangeResult});

      default:
          return Promise.resolve({data: []});

    }
  }
}
