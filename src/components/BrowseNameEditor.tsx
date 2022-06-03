import React from 'react';
import { InlineFormLabel, Input } from '@grafana/ui';

type BrowseNameEditorProps = {
  name: string;
  onNameChange: (attr: string) => void;
}

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