import React from 'react';
import { InlineFormLabel, Input } from '@grafana/ui';

type BrowseNameEditorProps = {
  name: string;
  onNameChange: (attr: string) => void;
}

// let indexTypes: SelectableValue[] = [
//   { value: 'all', label: 'All' }
// ];

// // 20 asteroids per page, maybe there's a way to select a different number per page?
// for (let i = 0; i< 20; i++) {
//   indexTypes.push({value: ''+i, label: ''+i}) 
// }

export const BrowseNameEditor = (props: BrowseNameEditorProps) => {
  return (
    <div className="gf-form">
      <InlineFormLabel>Name</InlineFormLabel>
      <Input
        value={props.name || ''}
        onChange={(e) => props.onNameChange(e.currentTarget.value)}
      />
    </div>
  )
};