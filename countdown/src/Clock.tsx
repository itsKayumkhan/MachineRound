import  { useEffect, useState } from "react";
import Btn from "./../Btn";
type Time = {
  h:number,
  m:number,
  s:number,
}
const Clock = () => {
  const [time, setTime] = useState<Time>({ h: 0, m: 0, s: 0 });
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);

  const runTime = () => {
    if (!paused) {
      if (time.s > 0) {
        setTime((p) => ({ ...p, s: p.s - 1 }));
      } else if (time.m > 0) {
        setTime((p) => ({ ...p, m: p.m - 1, s: 59 }));
      } else if (time.h > 0) {
        setTime((p) => ({ ...p, h: p.h - 1, m: 59, s: 59 }));
      } else {
        alert("Time over");
        setActive(false);
      }
    }
  };

  const check =({ h, m, s }:Time) => {
    // const copyTime = { ...time };
    // let { h, s, m } = copyTime;

    if (s > 60) {
      m = Math.floor(s / 60);
      s = s % 60;
    } else if (m > 60) {
      h = Math.floor(m / 60);
      m = m % 60;
    }

    setTime({ h, m, s });
  };

  const handelInput = (e:React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const name = e.target.name;

    if (isNaN(value)) return alert("please enter number only");

    // setTime(p=>{return {...p,[name]:value}})
    const timeC = { ...time, [name]: value };
    check(timeC);
  };
  const startClock = () => {
    if (time.h === 0 && time.m === 0 && time.s === 0) {
      alert("Please enter time to start");
      return;
    }
    setActive(true);
    setPaused(false);
  };

  const pauseClock = () => {
    setTime({h:0,m:0,s:0})
    setPaused((p) => !p);
  };

  useEffect(() => {
    if (active) {
      const interval = setInterval(runTime, 1000);
      return () => clearInterval(interval);
    }
  }, [active, paused, time]);


  return (
    <>
      {!active ? (
        <div className="flex justify-center items-center w-full h-full bg-slate-400">
          <input
            className="w-12 h-12 m-2 p-2 flex justify-center items-center"
            placeholder="HH"
            name="h"
            value={time.h}
            onChange={(e) => handelInput(e)}
          />
          <input
            className="w-12 h-12 m-2 p-2 flex justify-center items-center"
            placeholder="MM"
            name="m"
            value={time.m}
            onChange={(e) => handelInput(e)}
          />
          <input
            className="w-12 h-12 m-2 p-2 flex justify-center items-center"
            placeholder="SS"
            name="s"
            value={time.s}
            onChange={(e) => handelInput(e)}
          />
          <div className="flex justify-center items-center bg-slate-950 text-white rounded-sm">
            <Btn text="start" cb={startClock} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full bg-slate-400">
          <span className="w-12 h-12 m-2 p-2 bg-slate-300 flex justify-center items-center">
            {time.h < 10 ? `0${time.h}` : time.h}
          </span>
          <span className="w-12 h-12 m-2 p-2 bg-slate-300 flex justify-center items-center">
            {time.m < 10 ? `0${time.m}` : time.m}
          </span>
          <span className="w-12 h-12 m-2 p-2 bg-slate-300 flex justify-center items-center">
            {time.s < 10 ? `0${time.s}` : time.s}
          </span>
          <div className="m-2  flex justify-center items-center bg-slate-950 text-white rounded-sm">
            <Btn text={paused ? "Resume" : "Pause"} cb={pauseClock} />
          </div>
          <div className="m-2  flex justify-center items-center bg-slate-950 text-white rounded-sm">
            <Btn text="Reset" cb={() =>{  
              setTime({h:0,m:0,s:0});
              setActive(false)}
              } />
          </div>
        </div>
      )}
    </>
  );
};

export default Clock;
