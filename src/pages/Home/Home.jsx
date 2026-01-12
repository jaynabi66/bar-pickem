import { useNavigate } from 'react-router-dom';
import { ScanPage } from '../Scan/Scan';
import { StandingsPage } from '../Standings/Standings';
import './Home.css';

export const HomePage = '/';

const Home = () => {
    const navigate = useNavigate();

    const navigateScan = function() {
        navigate(ScanPage);
    };
    
    const navigateStandings = function() {
        navigate(StandingsPage);
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
                <button className='button' onClick={navigateStandings}>
                    STANDINGS
                </button>
            </div>
        </div>
    )
}

export default Home;
