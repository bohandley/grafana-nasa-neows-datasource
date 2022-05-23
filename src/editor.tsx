import React from 'react';
import { SelectableValue, QueryEditorProps } from '@grafana/data';
import { InlineFormLabel, Select, DatePickerWithInput } from '@grafana/ui';
import { BrowsePageEditor } from './components/BrowsePageEditor';
import { BrowseAttrEditor } from './components/BrowseAttrEditor';
import { BrowseIndexEditor } from './components/BrowseIndexEditor';
import { NasaNeoWsApi } from './datasource';
import { NasaNeoWsQueryType, NasaNeoWsQuery, NasaNeoWsConfig } from 'types';

const queryTypes: SelectableValue<NasaNeoWsQueryType>[] = [
  { value: 'browse', label: 'Browse by Page'},
  { value: 'range', label: 'Date Range'}
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
        <div className='gf-form'>
          <BrowsePageEditor 
            pageNum={query.pageNum || '0'}
            onPageNumChange={(pageNum: string) => {
              onChange({ ...query, pageNum });
              onRunQuery();
            }}
          />
          <BrowseAttrEditor
            attr={query.attr || ''}
            onAttrChange={(attr: string) => {
              onChange({ ...query, attr });
              onRunQuery();
            }}
          />
          <BrowseIndexEditor
            index={query.index || 'all'}
            onIndexChange={(index: string) => {
              onChange({ ...query, index });
              onRunQuery();
            }}
          />
        </div>
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
          <InlineFormLabel>Start Date</InlineFormLabel>
          <DatePickerWithInput
            value={query.startDate || new Date()}
            onChange={(e)=>{
              const startDate = e.toISOString().substring(0, 10);
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

