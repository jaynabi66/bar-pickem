import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanPage } from '../Scan/Scan';
import { setUpPage, clearLocalStorage } from './confirmHelpers';
import './Confirm.css';

export const ConfirmPage = '/scan/confirm';

const Confirm = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        setUpPage();
    }, []);
    
    const navigateBack = () => {
        navigate(ScanPage);
    };
    
    const confirmScan = () => {
        clearLocalStorage();
        navigate(ScanPage);
    };
    
    return (
        <div className='content confirm-component'>
            <div className='header-row'>
                <h1 className='title'>
                    BARPICKEM - CONFIRM
                </h1>

                <button className='button' onClick={navigateBack}>
                    BACK
                </button>
            </div>
            <div className='response'>
                <span id='pickemImages' className='response__images'></span>
                <span id='pickemBody' className='response__body'></span>
            </div>
            <div className='buttons-wrapper'>
                <button className='button' onClick={confirmScan}>
                    CONFIRM
                </button>
            </div>
        </div>
    )
}

export default Confirm;
