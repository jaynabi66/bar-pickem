import { useNavigate } from 'react-router-dom';
import { HomePage } from '../Home/Home';
import { handleChooseImage } from './scanHelpers.js';
import './Scan.css';

export const ScanPage = '/scan';

const Scan = () => {
    const navigate = useNavigate();

    const navigateHome = () => {
      navigate(HomePage);
    };
    
    const chooseImage = (event) => {
      const files = [...event.target.files];
      handleChooseImage(files);
    };
    
    const tryNavigateProcess = () => {};

    return (
        <div className='content scan-component'>
            <div className='header-row'>
                <h1 className='title'>
                    BARPICKEM - SCAN
                </h1>

                <button className='button' onClick={navigateHome}>
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
