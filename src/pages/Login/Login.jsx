import { useNavigate } from 'react-router-dom';
import { ScanPage } from '../Scan/Scan';
import { SignUpPage } from '../SignUp/SignUp';
import { handleLogin } from './loginHelpers.js';
import './Login.css';

export const LoginPage = '/login';

const Login = () => {
    const navigate = useNavigate();

    const tryLogin = async function() {
        const loginValid = await handleLogin();
        if (loginValid) {
            navigate(ScanPage);
        }
    };
    
    const navigateSignUp = function() {
        navigate(SignUpPage);
    };

    return (
        <div className='content login-component'>
            <h1 className='title'>
                LOGIN
            </h1>
            <div className='input-row'>
                <label htmlFor='username'>Username:</label>
                <input type='email' id='username' name='username' required></input>
            </div>
            <div className='input-row'>
                <label htmlFor='password'>Password:</label>
                <input type='password' id='password' name='password' required></input>
            </div>
            <div className='buttons-wrapper'>
                <button className='button' onClick={tryLogin}>
                    Log In
                </button>
                <button className='button' onClick={navigateSignUp}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Login;
