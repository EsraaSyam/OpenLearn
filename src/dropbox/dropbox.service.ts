import { BadRequestException, HttpException, Injectable, InternalServerErrorException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DropboxShareLinkResponse, DropboxTokenResponse } from './dropbox.interface';

@Injectable()
export class DropboxService {
    private accessToken: string;
    private refreshToken: string;
    private clientId: string;
    private clientSecret: string;
    private tokenExpiry: Date;

    constructor(private readonly configService: ConfigService) {
        this.refreshToken = this.configService.get<string>('DROPBOX_REFRESH_TOKEN');
        this.clientId = this.configService.get<string>('DROPBOX_CLIENT_ID');
        this.clientSecret = this.configService.get<string>('DROPBOX_CLIENT_SECRET');

        if (!this.refreshToken || !this.clientId || !this.clientSecret) {
            throw new InternalServerErrorException('Missing Dropbox configuration');
        }
    }

    async getAccessToken(): Promise<string> {
        if (await this.isAccessTokenValid()) {
            return this.accessToken;
        }

        try {
            const response = await axios.post<DropboxTokenResponse>('https://api.dropboxapi.com/oauth2/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                }
            });

            this.accessToken = response.data.access_token;

            this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000));

            return this.accessToken;

        } catch (error) {
            this.handleAxiosError(error);
        }
    }

    private async isAccessTokenValid(): Promise<boolean> {
        const bufferMs = 5 * 60 * 1000;
        return !!this.accessToken && !!this.tokenExpiry && this.tokenExpiry > new Date(Date.now() + bufferMs);
    }


    private handleAxiosError(error: any) {
        if (error.response && error.request) {
            const status = error.response?.status;
            const message = error.response?.data?.error_description || 'Unknown error';

            console.error('Dropbox Error Response:', error?.response?.data);

            if (status === 400) {
                throw new BadRequestException(`Bad request: ${message}`);
            }

            if (status === 401 || status === 403) {
                throw new UnauthorizedException(`Authentication failed: ${message}`);
            }

            if (status === 503) {
                throw new ServiceUnavailableException(`Dropbox service unavailable: ${message}`);
            }

            throw new InternalServerErrorException(`Dropbox error: ${message}`);
        }

        throw new InternalServerErrorException(`Unexpected error: ${error.message}`); 
    }


    async uploadFile(file: Express.Multer.File, folderPath: string): Promise<string> {
        if (!file || !file.buffer) throw new BadRequestException('File is required');

        const path = await this.generateDropboxPath(file.originalname, folderPath);

        const headers = await this.getDropboxHeaders({
            'Dropbox-API-Arg': JSON.stringify({
                path,
                mode: 'add',
                autorename: true,
                mute: false,
                strict_conflict: false,
            }),
            'Content-Type': 'application/octet-stream',
        });

        try {
            await axios.post('https://content.dropboxapi.com/2/files/upload', file.buffer, {
                headers,
            });

            const shareLink = await this.createShareLink(path);

            return await this.convertToDirectLink(shareLink);

        } catch (error) {
            this.handleAxiosError(error);
        }
    }

    private async convertToDirectLink(shareLink: string): Promise<string> {
        if (!shareLink) new BadRequestException('Share link is required to convert to direct link');

        const url = new URL(shareLink);
        url.searchParams.set('raw', '1');
        url.searchParams.delete('dl');

        return url.toString();
    }


    private async getDropboxHeaders(extraHeaders = {}): Promise<Record<string, string>> {
        const accessToken = await this.getAccessToken();
        return {
            Authorization: `Bearer ${accessToken}`,
            ...extraHeaders,
        };
    }

    private async generateDropboxPath(originalName: string, folderPath: string): Promise<string> {
        const cleanPath = folderPath.replace(/\/+$/, '');
        return `/uploads/${cleanPath}/${Date.now()}_${originalName}`;

    }


    private async createShareLink(path: string): Promise<string> {
        const accessToken = await this.getAccessToken();

        try {
            const response = await axios.post<DropboxShareLinkResponse>('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
                path,
                settings: {
                    requested_visibility: 'public',
                    audience: 'public',
                    access: 'viewer',
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data.url;
        } catch (error) {
            this.handleAxiosError(error);
        }
    }

}
