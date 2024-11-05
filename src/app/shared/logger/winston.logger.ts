import { createLogger, format, transports, config as wConfig } from 'winston';
import { resolve } from 'node:path';

export const logger = createLogger({
    levels: wConfig.syslog.levels,
    defaultMeta: { context: 'default' },
    transports: [
        new transports.File({
            level: 'debug',
            filename: 'combined.log',
            dirname: resolve(__dirname, '../../../../logs'),
            format: format.combine(
                format.label({ label: 'Info Combined' }),
                format.timestamp({
                    format: 'DD-MM-YYYY, HH:MM:SS',
                }),
                format.colorize({
                    all: true,
                })
            ),
        }),
    ],
});
