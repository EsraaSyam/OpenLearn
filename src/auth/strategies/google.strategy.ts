import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterRequest } from '../requests/register.request';
import { Roles } from 'src/user/enums/rols.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails } = profile;

        const email = emails[0].value;
        const firstName = name.givenName || '';
        const lastName = name.familyName || '';

        const user : RegisterRequest = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: Roles.USER,
            isOAuthUser: true,
        };

        done(null, user);
    }
}