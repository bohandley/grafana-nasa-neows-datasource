import React from 'react';
import { InlineFormLabel, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

type BrowseAttrEditorProps = {
  attr: string;
  onAttrChange: (attr: string) => void;
}

const attrTypes: SelectableValue[] = [
  { value: 'relative_velocity_kps', label: 'relative velocity (km/s)' },
  { value: 'miss_distance_km', label: 'miss distance (km)' },
  { value: 'absolute_magnitude_h', label: 'absolute magnitude' },
];

export const BrowseAttrEditor = (props: BrowseAttrEditorProps) => {
  return (
    <div className="gr-form">
      <InlineFormLabel>Neo Attrs</InlineFormLabel>
      <Select
        options={attrTypes}
        value={props.attr || ''}
        onChange={(e) => props.onAttrChange(e.value!)}
      />
    </div>
  )
};
