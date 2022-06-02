import React from 'react';
import { SelectableValue, QueryEditorProps } from '@grafana/data';
import { InlineFormLabel, Select, DatePickerWithInput, Input } from '@grafana/ui';
import { BrowsePageEditor } from './components/BrowsePageEditor';
import { BrowseAttrEditor } from './components/BrowseAttrEditor';
import { BrowseNameEditor } from './components/BrowseNameEditor';
import { NasaNeoWsApi } from './datasource';
import { NasaNeoWsQueryType, NasaNeoWsQuery, NasaNeoWsConfig } from 'types';

const queryTypes: SelectableValue<NasaNeoWsQueryType>[] = [
  { value: 'browse', label: 'Browse by Page'},
  { value: 'range', label: 'Date Range'}
]

const hazardousTypes: SelectableValue[] = [
  { value: 'none', label: 'None'},
  { value: 'true', label: 'true'},
  { value: 'false', label: 'false'},
  { value: '$hazardous', label: '$hazardous'},
]

export const ConfigEditor = () => {
  return <>Config Editor</>;
}

export const QueryEditor = (props: QueryEditorProps<NasaNeoWsApi, NasaNeoWsQuery, NasaNeoWsConfig>) => {
  const { query, onChange, onRunQuery } = props;

  return (
    <>
      <div className='gf-form'>
        <InlineFormLabel>Query Type</InlineFormLabel>
        <Select<NasaNeoWsQueryType>
          options={queryTypes}
          value={query.queryType || 'browse-by-page'}
          onChange={(e) => {
            onChange({...query, queryType: e.value } as NasaNeoWsQuery);
            onRunQuery();
          }}
        />
      </div>
      {query.queryType === 'browse' && (
        <>
          <div className='gf-form'>
            <BrowseAttrEditor
              attr={query.attr || ''}
              onAttrChange={(attr: string) => {
                onChange({ ...query, attr });
                onRunQuery();
              }}
            />
          </div>
          <div className='gf-form'>
            <BrowsePageEditor 
              page={query.page || '0'}
              onPageChange={(page: string) => {
                onChange({ ...query, page });
                onRunQuery();
              }}
            />
            <div className='gf-form'>
              <InlineFormLabel>Hazardous</InlineFormLabel>
              <Select
                options={hazardousTypes}
                value={query.hazardous ? query.hazardous : 'none'}
                onChange={(e) => {
                  onChange({...query, hazardous: e.value } as NasaNeoWsQuery);
                  onRunQuery();
                }}
              />
            </div>
          </div>
          <div className='gf-form'>
            <div className="gf-form">
              <InlineFormLabel>Orbiting Body</InlineFormLabel>
              <Input
                value={query.orbitingBody || ''}
                onChange={(e) => {
                  onChange({...query, orbitingBody: e.currentTarget.value} as NasaNeoWsQuery);
                  onRunQuery();
                }}
              />
            </div>
            <BrowseNameEditor
              name={query.name || ''}
              onNameChange={(name: string) => {
                onChange({ ...query, name });
                onRunQuery();
              }}
            />
          </div>
        </>
      )}
      {query.queryType === 'range' && (
        <div className='gf-form'>
          <BrowseAttrEditor
            attr={query.attr || ''}
            onAttrChange={(attr: string) => {
              onChange({ ...query, attr });
              onRunQuery();
            }}
          />
          <InlineFormLabel>Week Starting at</InlineFormLabel>
          <DatePickerWithInput
            value={query.startDate || new Date()}
            onChange={(e)=>{
              const nasaDate = new Date(e);
              const startDate = nasaDate.toISOString().substring(0, 10);
              onChange({ ...query, startDate });
              onRunQuery();
            }}
          />
          {/* {query.startDate && (
          <>
            <InlineFormLabel>End Date</InlineFormLabel>
            <DatePickerWithInput
              value={query.endDate}
              onChange={(e)=>{
                const endDate = e.toISOString().substring(0, 10);
                onChange({ ...query, endDate });
                onRunQuery();
              }}
            />
          </>
          )} */}
        </div>
      )}
    </>
  );
};

