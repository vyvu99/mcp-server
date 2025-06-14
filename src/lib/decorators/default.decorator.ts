import { Transform } from 'class-transformer';
import { cloneDeep } from 'lodash';

export function Default(defaultValue: unknown): PropertyDecorator {
  return Transform((value: unknown) => value ?? cloneDeep(defaultValue));
}
