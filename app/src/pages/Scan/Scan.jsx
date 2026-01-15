import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePage } from '../Home/Home';
import { ConfirmPage } from '../Confirm/Confirm';
import { setUpPage, handleChooseImage, processImage, clearLocalStorage } from './scanHelpers.js';
import './Scan.css';

export const ScanPage = '/scan';

const Scan = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setUpPage();
    }, []);
    
    const navigateBack = () => {
        clearLocalStorage();
        navigate(HomePage);
    };
    
    const chooseImage = (event) => {
        console.log(event);
        const files = [...event.target.files];
        handleChooseImage(files);
    };
    
    const tryNavigateProcess = async () => {
        if (await processImage()) {
            navigate(ConfirmPage);
        }
    };

    return (
        <div className='content scan-component'>
            <div className='header-row'>
                <h1 className='title'>
                    BARPICKEM - SCAN
                </h1>

                <button className='button' onClick={navigateBack}>
                    BACK
                </button>
            </div>
            <div className='scan'>
                <span id='pickemImages' className='scan__images'></span>
                <label id='pickemLabel' htmlFor='pickemInput' className='scan__label'>
                    Choose file
                </label>
                <input id='pickemInput' className='scan__input' type='file' accept='image/*' onChange={chooseImage} hidden/>
            </div>
            <div className='buttons-wrapper'>
                <button className='button' onClick={tryNavigateProcess}>
                    PROCESS
                </button>
            </div>
        </div>
    )
}

export default Scan;
