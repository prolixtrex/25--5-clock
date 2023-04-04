import { useEffect, useRef, useState } from "react";
import {useSelector, useDispatch} from "react-redux";
import { breakIncrement, breakDecrement, sessionIncrement, sessionDecrement, resetBS } from "../redux-reducer/reducerSlice";
import { FaArrowDown } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa';
import {HiPlayPause} from 'react-icons/hi2';
import {BiRefresh} from 'react-icons/bi';
import alarm from '../alarm/alarm_01.mp3';
import './clock.css';

export function Clock() {
    const breakLength = useSelector((state) => state.clock.breakLength);
    const sessionLength = useSelector((state) => state.clock.sessionLength);
    const [clockMin, setClockMin] = useState(25);
    const [clockSec, setClockSec] = useState('00');
    const [clockState, setClockState] = useState(false);
    const [clockType, setClockType] = useState('session'); //clocktype session or break
    const [sessionLabel, setSessionLabel] = useState('Session');
    const [redClass, setRedClass] = useState();
    const audio = useRef(null);
    const dispatch = useDispatch();
    
    const playAlarm = (para) => {
        if (para) {
            audio.current.play();
        } else {
            audio.current.pause();
        }
    }

    //start and stop clock
    function startStopClock(clockState) {
        clockState === false ? setClockState(true) : setClockState(false);
    }

    //timer resest button function
    function resetClock() {
        dispatch(resetBS());
        setClockMin(25);
        setClockSec('00');
        startStopClock();
        playAlarm(false);
    }

    //set the lenght of session and breaks
    function dispatchActions(actions) {
        switch (actions) {
            case breakDecrement:
                dispatch(breakDecrement());
                break;
            case breakIncrement:
                dispatch(breakIncrement());
                break;
            case sessionDecrement:
                dispatch(sessionDecrement());
                if (clockMin > 1) {
                    setClockMin(sessionLength - 1);
                    setClockType('session');
                    setSessionLabel('Session');
                }
                setClockSec('00');
                break;
            case sessionIncrement:
                dispatch(sessionIncrement());
                if (clockMin < 60) {
                    setClockMin(sessionLength + 1);
                    setClockType('session');
                    setSessionLabel('Session');
                }
                setClockSec('00');
                break;
            default:
                return('');
        }
    }

    //style session when clock minute is less than 1
    useEffect(() => {
        if (clockMin === '00') {
            setRedClass('red');
        } else {
            setRedClass();
        }

        if (clockMin === '00' && clockSec === '00') {
            playAlarm(true);
        }
    }, [clockMin, clockSec])

    //run the clock timer
    useEffect(() => {
        const interval = setInterval(() => {
            //toggle start and stop of clock
            if(clockState === true) {
                if (clockType === 'session') {
                    //session running
                    if(clockSec > '00') {
                        setClockSec((prevClockSec) => ('0'+(prevClockSec -= 1)).slice(-2));
                    } else if(clockSec === '00' && clockMin > '00') {
                        setClockMin((prevClockMin) => ('0'+(prevClockMin -= 1)).slice(-2));
                        setClockSec((prevClockSec) => prevClockSec = 59);
                    } else {
                        if (clockSec === '00' && clockMin === '00') {
                            setClockType('break');
                            setClockMin(breakLength);
                            setSessionLabel('Break');
                            setRedClass();
                        }
                    }
                } else {
                    //break running
                    if(clockSec > '00') {
                        setClockSec((prevClockSec) => ('0'+(prevClockSec -= 1)).slice(-2));
                    } else if(clockSec === '00' && clockMin > '00') {
                            setClockMin((prevClockMin) => ('0'+(prevClockMin -= 1)).slice(-2));
                            setClockSec((prevClockSec) => prevClockSec = 59);
                    } else {
                        if (clockSec === '00' && clockMin === '00') {
                            setClockType('session');
                            setClockMin(sessionLength);
                            setSessionLabel('Session');
                        }
                    }
                }
            } else {
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [clockState, clockSec, clockMin, clockType, breakLength, sessionLength]);


    return (
        <div>
            <div id="main">
                <div><h1>25 + 5 clock</h1></div>
                <div className="break-session">
                    <div className="break">
                        <h2 id="break-label">Break Length</h2>
                        <div className="controls">
                            <button 
                                id="break-decrement"
                                onClick={
                                    () => clockState ? '' : dispatchActions(breakDecrement)
                                    }><FaArrowDown /></button>
                            <span id="break-length">{breakLength}</span>
                            <button 
                                id="break-increment"
                                onClick={
                                    () => clockState ? '' : dispatchActions(breakIncrement)
                                }><FaArrowUp /></button>
                        </div>
                    </div>
                    <div>
                        <h2 id="session-label">Session Length</h2>
                        <div className="controls">
                            <button 
                                id="session-decrement"
                                onClick={
                                    () => clockState ? '' : dispatchActions(sessionDecrement)
                                }><FaArrowDown /></button>
                            <span id="session-length">{sessionLength}</span>
                            <button 
                                id="session-increment"
                                onClick={
                                    () => clockState ? '' : dispatchActions(sessionIncrement)
                                }><FaArrowUp /></button>
                        </div>
                    </div>
                </div>
                <div className={`session ${redClass}`}>
                    <h2 id="timer-label">{sessionLabel}</h2>
                    <div id="time-left">
                        <span>{clockMin}</span>{":"}<span>{clockSec}</span>
                    </div>
                </div>
                <div>
                    <button id="start_stop" onClick={() => startStopClock(clockState)}><HiPlayPause /></button>
                    <button id="reset" onClick={() => resetClock()}><BiRefresh /></button>
                </div>
                <div>
                    <audio src={alarm} ref={audio}/>
                </div>
                <div>
                    <p>Designed and <code>Coded</code> By</p>
                    <p>Bright Anua</p>
                </div>
            </div>
        </div>
    )
}