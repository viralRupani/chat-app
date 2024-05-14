import { registerEnumType } from '@nestjs/graphql';

export enum otp_type_enum {
    register_user = 'REGISTER_USER',
    forgot_password = 'FORGOT_PASSWORD',
}

export enum mail_template_enum {
    send_otp = 'send-otp',
}

export enum chat_type_enum {
    group = 'group',
    direct_message = 'direct_message',
}

export enum mail_subject_enum {
    register_otp = '[Chat App]: Otp for signing up 😃.',
    forgot_pass_otp = '[Chat App]: Otp for changing password!',
}

export enum role_type_enum {
    member = 'member',
    admin = 'admin',
}

// Enums Registration for api.
registerEnumType(otp_type_enum, {
    name: 'otp_type_enum',
});

registerEnumType(chat_type_enum, {
    name: 'chat_type_enum',
});

registerEnumType(mail_template_enum, {
    name: 'mail_template_enum',
});

registerEnumType(mail_subject_enum, {
    name: 'mail_subject_enum',
});

registerEnumType(role_type_enum, {
    name: 'role_type_enum',
});
