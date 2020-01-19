import schedule, { scheduleJob } from 'node-schedule';
import shortid from 'shortid';
import { ITiming, ITimingRaw, EStatics, EEvery, ETyp, IJob, TStat, TScheduled, TIMING } from './types';


export default class Scheduler {
    private jobs : IJob[] = [];

    constructor() {

    }

    static getTimingsObject(typ : TIMING) : ITiming {
        const times : ITiming = {
            typ : typ,
            second: 0,
            minute : 0,
            hour: 0,
            month: 0,
            dayOfMonth : 0,
            dayOfWeek : 0
        }
        return times;
    }

    
    private timeparser(times:ITiming) : string {
        let timeString : string | undefined = undefined;

        function decideChar(num : number) : string | number {
            if(num < 0) {
                return '*'
            } else return num;
        }

        if(times.typ === ETyp.SCHEDULED) {
            timeString = `${decideChar(times.second)} ${decideChar(times.minute)} ${decideChar(times.hour)} ${decideChar(times.dayOfMonth)} ${decideChar(times.month)} ${decideChar(times.dayOfWeek)}`;
        };

        if(times.typ === ETyp.STATIC) {
            timeString = `/${decideChar(times.second)} ${decideChar(times.minute)} ${decideChar(times.hour)} ${decideChar(times.dayOfMonth)} ${decideChar(times.month)} ${decideChar(times.dayOfWeek)}`;
        };

        if(!timeString) throw new Error('Es wurde ein falscher Typ angegeben! ETyp.SCHEDULED | ETyp.STATIC');
        return timeString;
    }

    private anotherParser() {

    }

    private evaluateTimings(timings:ITiming) : boolean {
        if(timings.second > 60 || timings.second < -1) return false;
        if(timings.minute > 60 || timings.minute < -1) return false;
        if(timings.hour > 24 || timings.hour < -1) return false;
        if(timings.dayOfMonth > 31 || timings.dayOfMonth < -1) return false;
        if(timings.month > 12 || timings.month < -1) return false;
        if(timings.dayOfWeek > 7 || timings.dayOfWeek < -1) return false;
        return true  
    }

    public addJob (name : string = shortid.generate(), timings : ITiming, fn :any) {
        console.log("timings: ", timings);
        if(!this.evaluateTimings(timings)) throw new Error('Das Timings Objekt ist falsch. Ueberpruefe deine Eingaben!');

        const jobObj : IJob = {
            name, 
            timings,
            fn,
            activated : false,
            executionCounter : 0
        };

        this.jobs.push(jobObj);
        return this.jobs;
    }

    public removeJob( name : string) {
        this.jobs = this.jobs.filter( job => {
            return job.name != name;
        });
        return this.jobs;
    }

    public startJob( name : string = shortid.generate(), timings : ITiming, fn : any) {
        const sym = Symbol();
        function wrapping(){

        }
        
        const job : any = schedule.scheduleJob(this.timeparser(timings), fn);

        const jobObj : IJob = {
            name,
            timings,
            fn,
            job,
            activated : true,
            executionCounter : 0,
        }

        this.jobs.push(jobObj);
        return this.jobs;
    }

    public stopJob( name : string) {
        const job = this.jobs.filter( job => {
            return job.name === name;
        })

        if(!job[0].job) return `Der Job "${name}" ist nicht vorhanden oder gestartet!`;
        job[0].job.cancel();

        this.jobs = this.jobs.filter( job => {
            return job.name != name;
        });
        return this.jobs;
    }

    public start() {
        this.jobs.forEach( job => {
            console.log("job zum starten : ", job);
            if(!job.activated) {
                console.log("timings: ", this.timeparser(job.timings));
                job.job = schedule.scheduleJob(this.timeparser(job.timings), job.fn);
                job.activated = true;
            }
        })
    }

    public stop() {
        this.jobs.forEach( job => {
            if(job.activated){
                
                if(!job.job) throw new Error('Es gab ein Problem beim stoppen der Jobs');
                job.job.cancel();
                
                job.job = undefined;
                job.activated = false;
            }
        })
    }

    public get getJobs() : IJob[] {
        return this.jobs;
    }

    public getJob(name:string) : IJob {
        const job = this.jobs.filter ( job => {
            return name === job.name;
        });

        if(job.length !== 1) throw new Error(`Den Job ${name} gibt es nicht!`);
        return job[0];
    }

    public get activeJobs() : IJob[] {
        const activeJobs = this.jobs.filter( job => {
            return job.activated === true;
        })
        return activeJobs;
    }

    public get unactiveJobs() : IJob[] {
        const unactiveJobs = this.jobs.filter( job => {
            return job.activated === false;
        })
        return this.activeJobs;
    }
}
