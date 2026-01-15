import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage } from '../Home/Home';
import { setUpPage, clearLocalStorage } from './standingsHelper.js';
import './Standings.css';

export const StandingsPage = '/standings';

const Standings = () => {
    const navigate = useNavigate();
    const didRun = useRef(false);
    
    useEffect(() => {
        if (didRun.current) return;
        setUpPage();
        didRun.current = true;
    }, []);

    const navigateBack = () => {
        navigate(HomePage);
    };
    
    const clear = () => {
        clearLocalStorage();
    };

    return (
        <div className='content standings-component'>
            <div className='header-row'>
                <h1 className='title'>
                    BARPICKEM - STANDINGS
                </h1>

                <button className='button' onClick={navigateBack}>
                    BACK
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Week 01</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td><b>Score</b></td>
                        <td>56</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div className='buttons-wrapper'>
                <button className='button' onClick={clear}>
                    CLEAR
                </button>
            </div>
        </div>
    )
}

export default Standings;
