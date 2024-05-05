export enum Message {
    OTP_SENT = 'Otp has been sent to your email.',
    UNAUTHORIZED = 'Email or password Wrong',
    LOGGED_IN = 'Logged in successfully',
    USER_ALREADY_EXIST = 'User already exist with this phone number',
    MAIL_ERR = 'Some error occurred while sending e-mail, please try again after some time.',
    USER_NOT_FOUND = 'User not found with this email',
    INVALID_OTP = 'Otp you entered is not valid',
    OTP_VERIFIED = 'Otp Verified successfully',
    SAME_PASSWORD = 'Passwords can not be same',
    PASS_CHANGED = 'Password changed successfully',
    WRONG_PASS = 'Wrong password',
}
