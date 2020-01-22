"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_schedule_1 = __importDefault(require("node-schedule"));
var shortid_1 = __importDefault(require("shortid"));
var types_1 = require("./types");
var Scheduler = (function () {
    function Scheduler() {
        this.jobs = [];
    }
    Scheduler.getTimingsObject = function (typ) {
        var times = {
            typ: typ,
            second: 0,
            minute: 0,
            hour: 0,
            month: 0,
            dayOfMonth: 0,
            dayOfWeek: 0
        };
        return times;
    };
    Scheduler.prototype.timeparser = function (times) {
        var timeString = undefined;
        function decideChar(num) {
            if (num < 0) {
                return '*';
            }
            else
                return num;
        }
        if (times.typ === types_1.ETyp.SCHEDULED) {
            timeString = decideChar(times.second) + " " + decideChar(times.minute) + " " + decideChar(times.hour) + " " + decideChar(times.dayOfMonth) + " " + decideChar(times.month) + " " + decideChar(times.dayOfWeek);
        }
        ;
        if (times.typ === types_1.ETyp.STATIC) {
            timeString = "/" + decideChar(times.second) + " " + decideChar(times.minute) + " " + decideChar(times.hour) + " " + decideChar(times.dayOfMonth) + " " + decideChar(times.month) + " " + decideChar(times.dayOfWeek);
        }
        ;
        if (!timeString)
            throw new Error('Es wurde ein falscher Typ angegeben! ETyp.SCHEDULED | ETyp.STATIC');
        return timeString;
    };
    Scheduler.prototype.anotherParser = function () {
    };
    Scheduler.prototype.evaluateTimings = function (timings) {
        if (timings.second > 60 || timings.second < -1)
            return false;
        if (timings.minute > 60 || timings.minute < -1)
            return false;
        if (timings.hour > 24 || timings.hour < -1)
            return false;
        if (timings.dayOfMonth > 31 || timings.dayOfMonth < -1)
            return false;
        if (timings.month > 12 || timings.month < -1)
            return false;
        if (timings.dayOfWeek > 7 || timings.dayOfWeek < -1)
            return false;
        return true;
    };
    Scheduler.prototype.addJob = function (name, timings, fn) {
        if (name === void 0) { name = shortid_1.default.generate(); }
        console.log("timings: ", timings);
        if (!this.evaluateTimings(timings))
            throw new Error('Das Timings Objekt ist falsch. Ueberpruefe deine Eingaben!');
        var jobObj = {
            name: name,
            timings: timings,
            fn: fn,
            activated: false,
            executionCounter: 0
        };
        this.jobs.push(jobObj);
        return this.jobs;
    };
    Scheduler.prototype.removeJob = function (name) {
        this.jobs = this.jobs.filter(function (job) {
            return job.name != name;
        });
        return this.jobs;
    };
    Scheduler.prototype.startJob = function (name, timings, fn) {
        if (name === void 0) { name = shortid_1.default.generate(); }
        var sym = Symbol();
        function wrapping() {
        }
        var job = node_schedule_1.default.scheduleJob(this.timeparser(timings), fn);
        var jobObj = {
            name: name,
            timings: timings,
            fn: fn,
            job: job,
            activated: true,
            executionCounter: 0,
        };
        this.jobs.push(jobObj);
        return this.jobs;
    };
    Scheduler.prototype.stopJob = function (name) {
        var job = this.jobs.filter(function (job) {
            return job.name === name;
        });
        if (!job[0].job)
            return "Der Job \"" + name + "\" ist nicht vorhanden oder gestartet!";
        job[0].job.cancel();
        this.jobs = this.jobs.filter(function (job) {
            return job.name != name;
        });
        return this.jobs;
    };
    Scheduler.prototype.start = function () {
        var _this = this;
        this.jobs.forEach(function (job) {
            console.log("job zum starten : ", job);
            if (!job.activated) {
                console.log("timings: ", _this.timeparser(job.timings));
                job.job = node_schedule_1.default.scheduleJob(_this.timeparser(job.timings), job.fn);
                job.activated = true;
            }
        });
    };
    Scheduler.prototype.stop = function () {
        this.jobs.forEach(function (job) {
            if (job.activated) {
                if (!job.job)
                    throw new Error('Es gab ein Problem beim stoppen der Jobs');
                job.job.cancel();
                job.job = undefined;
                job.activated = false;
            }
        });
    };
    Object.defineProperty(Scheduler.prototype, "getJobs", {
        get: function () {
            return this.jobs;
        },
        enumerable: true,
        configurable: true
    });
    Scheduler.prototype.getJob = function (name) {
        var job = this.jobs.filter(function (job) {
            return name === job.name;
        });
        if (job.length !== 1)
            throw new Error("Den Job " + name + " gibt es nicht!");
        return job[0];
    };
    Object.defineProperty(Scheduler.prototype, "activeJobs", {
        get: function () {
            var activeJobs = this.jobs.filter(function (job) {
                return job.activated === true;
            });
            return activeJobs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scheduler.prototype, "unactiveJobs", {
        get: function () {
            var unactiveJobs = this.jobs.filter(function (job) {
                return job.activated === false;
            });
            return this.activeJobs;
        },
        enumerable: true,
        configurable: true
    });
    return Scheduler;
}());
exports.default = Scheduler;
//# sourceMappingURL=index.js.map