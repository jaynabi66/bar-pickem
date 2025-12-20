import { useNavigate } from 'react-router-dom';
import { ScanPage } from '../Scan/Scan';
import { LoginPage } from '../Login/Login';
import './SignUp.css';

export const SignUpPage = '/sign-up';

const SignUp = () => {
    const navigate = useNavigate();

    const navigateScan = () => {
      navigate(ScanPage);
    };
    
    const navigateLogin = () => {
      navigate(LoginPage);
    };

    return (
        <div className='content sign-up-component'>
            <h1 className='title'>
                SIGN UP
            </h1>
            <div className='input-row'>
                <label htmlFor="username">Username:</label>
                <input type="email" id="username" name="username" required></input>
            </div>
            <div className="input-row">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required></input>
            </div>
            <div className="input-row">
                <label htmlFor="password-2">Confirm password:</label>
                <input type="password" id="password-2" name="password-2" required></input>
            </div>
            <div className="buttons-wrapper">
                <button className="button" onClick={navigateLogin}>
                    Back
                </button>
                <button className="button" onClick={navigateScan}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default SignUp;
