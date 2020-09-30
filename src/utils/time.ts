export function delay(time: number = 200): Promise<any> {
    return new Promise<any>(function (resolve) {
        setTimeout(resolve, time);
    })
}

export function startCountdown(time: number, onPerSeconds: any, onTimeUp: any) {
    const interval = setInterval(() => {
        if (time < 1) {
            clearInterval(interval);
            return typeof onTimeUp === 'function' && onTimeUp();
        }
        time--;
        typeof onPerSeconds === 'function' && onPerSeconds(time);
    }, 1000);
    return interval;
}

export function getWeekNumber(dt) {
    let d1 = new Date(dt);
    let d2 = new Date(dt);
    d2.setMonth(0);
    d2.setDate(1);
    // @ts-ignore
    let rq = d1 - d2;
    let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
    let num = Math.ceil(days / 7);
    return num;
}
