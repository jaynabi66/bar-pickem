import { useNavigate } from 'react-router-dom';
import { ScanPage } from '../Scan/Scan';
import { ResultsPage } from '../Results/Results';
import './Home.css';

export const HomePage = '/';

const Home = () => {
    const navigate = useNavigate();

    const navigateScan = function() {
        navigate(ScanPage);
    };
    
    const navigateResults = function() {
        navigate(ResultsPage);
    };

    return (
        <div className='content home-component'>
            <h1 className='title'>
                BARPICKEM
            </h1>
            <div className='buttons-wrapper'>
                <button className='button' onClick={navigateScan}>
                    SCAN
                </button>
                <button className='button' onClick={navigateResults}>
                    STANDINGS
                </button>
            </div>
        </div>
    )
}

export default Home;
