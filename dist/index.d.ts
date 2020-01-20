import { ITiming, IJob, TIMING } from './types';
export default class Scheduler {
    private jobs;
    constructor();
    static getTimingsObject(typ: TIMING): ITiming;
    private timeparser;
    private anotherParser;
    private evaluateTimings;
    addJob(name: string | undefined, timings: ITiming, fn: any): IJob[];
    removeJob(name: string): IJob[];
    startJob(name: string | undefined, timings: ITiming, fn: any): IJob[];
    stopJob(name: string): string | IJob[];
    start(): void;
    stop(): void;
    get getJobs(): IJob[];
    getJob(name: string): IJob;
    get activeJobs(): IJob[];
    get unactiveJobs(): IJob[];
}
