import React from 'react';
import { InlineFormLabel, Input } from '@grafana/ui';

type BrowsePageEditorProps = {
  page: string;
  onPageChange: (page: string) => void;
}

export const BrowsePageEditor = (props: BrowsePageEditorProps) => {
  return (
    <div className="gf-form">
      <InlineFormLabel>Page Number</InlineFormLabel>
      <Input
        value={props.page || '0'}
        onChange={(e) => props.onPageChange(e.currentTarget.value)}
        title="0 to 1468"
      />
    </div>
  )
};
