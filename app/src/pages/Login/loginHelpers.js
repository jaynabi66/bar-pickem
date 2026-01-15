export async function handleLogin () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput.value === '') {
        usernameInput.setCustomValidity("Email is required!");
        usernameInput.reportValidity();
        return false;
    }
    if (passwordInput.value === '') {
        passwordInput.setCustomValidity("Password is required!");
        passwordInput.reportValidity();
        return false;
    }

    return true;
}
