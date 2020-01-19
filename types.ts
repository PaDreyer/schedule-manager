import schedule, { scheduleJob } from "node-schedule";
import Scheduler from "./scheduler";

export interface IPoint {
    fieldName : string;
    query : string;
    unit : string;
}

export interface IData {
    field : string;
    value : string | number;
    unit : string;
}

export enum EEvery {
    TYP = 'every',
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = "month",
}

export enum EStatics {
    TYP = 'static',
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = "month",
}

export enum ETyp {
    STATIC = 'static',
    SCHEDULED = 'scheduled'
}

export type TStat = 'static';
export type TScheduled = 'scheduled';
export type TIMING = TStat | TScheduled;

export interface ITimingRaw  {
    second : number;
    minute : number;
    hour : number;
    dayOfMonth : number;
    month : number
    dayOfWeek : number;
}

export interface ITiming extends ITimingRaw {
    typ : TStat | TScheduled;
}

export interface IJob {
    name : string;
    timings : ITiming;
    fn : any;
    job? : schedule.Job;
    activated : boolean;
    executionCounter : number;
}