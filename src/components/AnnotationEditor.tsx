import React, { useState } from 'react';
import { InlineFormLabel, Input } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { NasaNeoWsApi } from '../datasource';
import { NasaNeoWsQuery, NasaNeoWsEventsQuery } from 'types';

export const AnnotationEditor = (props: QueryEditorProps<NasaNeoWsApi, NasaNeoWsQuery>) => {
  const { query, onChange } = props;
  const [ names, setNames] = useState<string>((query?.eventsQuery?.names || []).join(','));
  const [ size, setSize] = useState<string>((query?.eventsQuery?.size || ''));
  const [ velocity, setVelocity] = useState<string>((query?.eventsQuery?.velocity || ''));
  const [ hazardous, setHazardous] = useState<string>((query?.eventsQuery?.hazardous || ''));
  const updateValue = <K extends keyof NasaNeoWsEventsQuery, V extends NasaNeoWsEventsQuery[K]>(key: K, val: V) => {
    onChange({ ...query, eventsQuery: { ...query?.eventsQuery, [key]: val } });
  };

  return (
    <div className="gf-form-group">
      <div className="gf-fform">
        <InlineFormLabel width={7} tooltip="A comma separated string of names">
          Names
        </InlineFormLabel>
        <Input 
          width={30}
          value={names || ''}
          onChange={e => setNames(e.currentTarget.value || '')}
          onBlur={() => updateValue('names', names.split(','))}
        />
      </div>
      <div className="gf-fform">
        <InlineFormLabel width={7} tooltip="A comparison of sizes, e.g. >1000000">
          Size
        </InlineFormLabel>
        <Input 
          width={30}
          value={size || ''}
          onChange={e => setSize(e.currentTarget.value || '')}
          onBlur={() => updateValue('size', size)}
        />
      </div>
      <div className="gf-fform">
        <InlineFormLabel width={7} tooltip="A comparison of size. e.g. <100000kps">
          Velocity
        </InlineFormLabel>
        <Input 
          width={30}
          value={velocity || ''}
          onChange={e => setVelocity(e.currentTarget.value || '')}
          onBlur={() => updateValue('velocity', velocity)}
        />
      </div>
      <div className="gf-fform">
        <InlineFormLabel width={7} tooltip="Tag all NEOs that are potentially hazardous(true) or not(false)">
          Hazardous
        </InlineFormLabel>
        <Input 
          width={30}
          value={hazardous || ''}
          onChange={e => setHazardous(e.currentTarget.value || '')}
          onBlur={() => updateValue('hazardous', hazardous)}
        />
      </div>
    </div>
  )

}
