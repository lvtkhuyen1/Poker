export default class ITimer
{
    constructor()
    {
        this.timeStart = new Date();
        this.timeEnd = new Date();
    }

    UpdateStart()
    {
        this.timeStart = new Date();
    }

    UpdateEnd()
    {
        this.timeEnd = new Date();
    }

    GetElapsedTime()
    {
        return (this.timeEnd - this.timeStart) / 1000;
    }

    GetElapsedMilliTime()
    {
        return (this.timeEnd - this.timeStart);
    }
};
