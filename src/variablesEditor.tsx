import React from 'react';
import { RadioButtonGroup, InlineFormLabel, Input } from '@grafana/ui';
import { NasaNeoWsVariableQuery, VariableQueryType } from 'types';
import { SelectableValue,  } from '@grafana/data';

type NasaNeoWsVariableEditorProps = {
  query: NasaNeoWsVariableQuery;
  onChange: (query: NasaNeoWsVariableQuery) => void;
};

const variableQueryTypes: SelectableValue<VariableQueryType>[] = [
  { value: 'name', label: 'Neo Name' },
  { value: 'hazardous', label: 'Is Potentially Hazardous?' },
  { value: 'orbitingBody', label: 'Orbiting Body' },
  { value: 'page', label: 'Page Number' },
];

export const NasaNeoWsVariableEditor = (props: NasaNeoWsVariableEditorProps) => {
  return (
    <>
      <div className="gf-form">
        <InlineFormLabel>Query Type</InlineFormLabel>
        <RadioButtonGroup<VariableQueryType>
          value={props.query.queryType || 'name'}
          options={variableQueryTypes}
          onChange={(e: any) => {
            props.onChange({ ...props.query, queryType: e });
          }}
        />
      </div>
      { props.query.queryType === 'name' && (
        <>
          <div className="gf-form">
            <InlineFormLabel>Is Potentially Hazardous?</InlineFormLabel>
            <Input
              value={props.query.hazardous}
              onChange={(e) => {
                props.onChange({ ...props.query, hazardous: e.currentTarget.value } as NasaNeoWsVariableQuery )
              }}
            />
          </div>
          <div className="gf-form">
            <InlineFormLabel>Orbiting Body</InlineFormLabel>
            <Input
              value={props.query.orbitingBody}
              onChange={(e) => {
                props.onChange({ ...props.query, orbitingBody: e.currentTarget.value} as NasaNeoWsVariableQuery)
              }}
            />
          </div>
          <div className="gf-form">
            <InlineFormLabel>Page</InlineFormLabel>
            <Input
              value={props.query.page}
              onChange={(e) => {
                props.onChange({ ...props.query, page: e.currentTarget.value} as NasaNeoWsVariableQuery)
              }}
            />
          </div>
        </>
      )}
      { (props.query.queryType === 'hazardous' || props.query.queryType === 'orbitingBody') && (
        <>
          <div className="gf-form">
            <InlineFormLabel>Page Number</InlineFormLabel>
            <Input
              value={props.query.page}
              onChange={(e) => {
                props.onChange({ ...props.query, page: e.currentTarget.value} as NasaNeoWsVariableQuery)
              }}
            />
          </div>
        </>
      )}
    </>
  )
}