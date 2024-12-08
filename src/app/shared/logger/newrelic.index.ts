import 'newrelic';
import * as newrelicFormatter from '@newrelic/winston-enricher';
import * as winston from 'winston';
import { Format } from 'logform';
export const formatter: () => Format = (newrelicFormatter as any)(winston);
