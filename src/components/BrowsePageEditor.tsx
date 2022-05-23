import React from 'react';
import { InlineFormLabel, Input } from '@grafana/ui';

type BrowsePageEditorProps = {
  pageNum: string;
  onPageNumChange: (pageNum: string) => void;
}

export const BrowsePageEditor = (props: BrowsePageEditorProps) => {
  return (
    <div className="gf-form">
      <InlineFormLabel>Page Number</InlineFormLabel>
      <Input
        value={props.pageNum || '0'}
        onChange={(e) => props.onPageNumChange(e.currentTarget.value)}
        title="0 to 1468"
      />
    </div>
  )
};
