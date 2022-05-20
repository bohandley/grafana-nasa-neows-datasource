import { DataSourcePlugin } from '@grafana/data';
import { NasaNeoWsApi } from './datasource';
import { ConfigEditor, QueryEditor } from 'editor';
import { 
  NasaNeoWsQuery, 
  NasaNeoWsConfig, 
  NasaNeoWsSecureConfig 
} from './types';

export const plugin = new DataSourcePlugin<NasaNeoWsApi, NasaNeoWsQuery, NasaNeoWsConfig, NasaNeoWsSecureConfig> (
  NasaNeoWsApi
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor)


