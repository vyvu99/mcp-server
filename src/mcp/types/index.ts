import { Implementation } from '@modelcontextprotocol/sdk/types';
import { ModuleMetadata, FactoryProvider } from '@nestjs/common';

export type McpOptions = Implementation;

export type McpAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<McpOptions>, 'useFactory' | 'inject'>;

export enum McpTokensEnum {
  OPTIONS = 'OPTIONS',
}
