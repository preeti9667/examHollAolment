import { Transform } from 'class-transformer';
import * as moment from 'moment';

export function format12TO24(value: string): number {
    const time = moment(value, 'hh:mm A').format('HH:mm');
    const n = Number(time.replace(':', '.').trim());
    return n;
}

export function format24TO12(value: number): string {
    const [hh, mm = '0'] = `${value}`.split('.');
    return moment(`${hh.padStart(2, '0')}:${mm.padEnd(2, '0')}`, 'HH:mm').format(
        'hh:mm A',
    );
}

export function Format24TO12() {
    return Transform((obj) => {
        return format24TO12(obj.value);
    });
}

export function Format24TO12Opt() {
    return Transform((obj) => {
        if (obj.value) return format24TO12(obj.value);
    });
}

export enum DURATION_FORMAT {
    HhMmSs = 'hh:mm:ss',
}

export function formatSeconds(
    seconds: number,
    format: DURATION_FORMAT = DURATION_FORMAT.HhMmSs,
): string {
    const duration = moment.duration(seconds * 1000);
    const [hh, mm, ss] = [
        `${duration.hours()}`,
        `${duration.minutes()}`,
        `${duration.seconds()}`,
    ];
    if ((format = DURATION_FORMAT.HhMmSs)) {
        return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${ss.padStart(
            2,
            '0',
        )}`;
    } else `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
}

export function FormatSeconds(format: DURATION_FORMAT) {
    return Transform((obj) => {
        return formatSeconds(obj.value, format);
    });
}

export function hourToSeconds(hours: number): number {
    return hours * 60 * 60;
}

export function secondsToHours(seconds: number): number {
    return Number((seconds / (60 * 60)).toFixed(2));
}

export function SecondsToHours() {
    return Transform((obj) => {
        return secondsToHours(obj.value);
    });
}


export function dateStringToUtc(date: string): Date {
    return new Date(new Date(date).setUTCHours(0, 0, 0, 0))
}

export function utcToDateString(date: Date): string {
    return moment(date).format('YYYY-MM-DD')
}


export function UtcToDateString() {
    return Transform((obj) => {
        return utcToDateString(obj.value);
    });
}