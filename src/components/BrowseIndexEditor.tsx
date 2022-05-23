import React from 'react';
import { InlineFormLabel, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

type BrowseIndexEditorProps = {
  index: string;
  onIndexChange: (attr: string) => void;
}

let indexTypes: SelectableValue[] = [
  { value: 'all', label: 'All' }
];

// 20 asteroids per page, maybe there's a way to select a different number per page?
for (let i = 0; i< 20; i++) {
  indexTypes.push({value: ''+i, label: ''+i}) 
}

export const BrowseIndexEditor = (props: BrowseIndexEditorProps) => {
  return (
    <div className="gf-form">
      <InlineFormLabel>Neo Attrs</InlineFormLabel>
      <Select
        options={indexTypes}
        value={props.index || 'all'}
        onChange={(e) => props.onIndexChange(e.value!)}
      />
    </div>
  )
};