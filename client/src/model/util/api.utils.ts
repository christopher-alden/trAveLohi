export enum ApiEndpoints {
    EmailSendWelcome = 'http://localhost:8000/api/send-welcome-email',
    EmailSendOTP = 'http://localhost:8000/api/send-otp-email',
    UserGetData = 'http://localhost:8000/api/user',
    UserRegister = 'http://localhost:8000/api/register',
    UserLogin = 'http://localhost:8000/api/login',
    UserLoginOTP = 'http://localhost:8000/api/login-otp',
    UserLogout = 'http://localhost:8000/api/logout',
    GeoGuesser = 'http://localhost:5000/geoguesser-guess',
    UserValidateEmail = 'http://localhost:8000/api/validate-reset-password-email'

}