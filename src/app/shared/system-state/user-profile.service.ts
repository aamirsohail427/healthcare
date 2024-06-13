import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { StorageHelper, storageKeys } from '..';

@Injectable()
export class UserProfileService {

    public isExternalLink = false;

    private userInfoCookiekeys: Array<string> = [
        storageKeys.id,
        storageKeys.loginId,
        storageKeys.isAdmin,
        storageKeys.userName,
        storageKeys.image,
        storageKeys.roleId];

    constructor(private router: Router,
        private storageHelper: StorageHelper,
        private cookieService: CookieService) {

    }

    public loadDefaultPage = false;

    set rememberMeToken(rememberMeToken: string) {
        if (!this.isExternalLink) {
            this.storageHelper.setNeverExpiredCookie(storageKeys.rememberMeToken, rememberMeToken);
        }
    }

    get rememberMeToken() {
        return this.storageHelper.getCookie(storageKeys.rememberMeToken);
    }

    set isRememberMe(isRememberMe: boolean) {
        if (!this.isExternalLink) {
            this.storageHelper.setNeverExpiredCookie(storageKeys.isRememberMe, String(isRememberMe));
        }
    }

    get isRememberMe() {
        const isRememberMe = this.storageHelper.getCookie(storageKeys.isRememberMe);
        if (isRememberMe === 'true') {
            return true;
        } else {
            return false;
        }
    }

    set isAdmin(isAdmin: boolean) {
        sessionStorage.setItem(storageKeys.isAdmin, String(isAdmin));
        if (!this.isExternalLink) {
            this.storageHelper.setCookie(storageKeys.isAdmin, String(isAdmin));
        }
    }

    get isAdmin() {
        const isAdmin = sessionStorage.getItem(storageKeys.isAdmin);
        if (isAdmin === 'true') {
            return true;
        } else {
            return false;
        }
    }

    set id(id: string) {
        sessionStorage.setItem(storageKeys.id, id.toString());
        if (!this.isExternalLink) {
            this.storageHelper.setNeverExpiredCookie(storageKeys.id, id.toString());
        }
    }

    get id() {
        return sessionStorage.getItem(storageKeys.id);
    }

    set userName(userName: string) {
        sessionStorage.setItem(storageKeys.userName, userName);
        if (!this.isExternalLink) {
            this.storageHelper.setCookie(storageKeys.userName, userName);
        }
    }

    get userName() {
        return sessionStorage.getItem(storageKeys.userName);
    }

    set roleId(role: string) {
        sessionStorage.setItem(storageKeys.roleId, role.toString());
        if (!this.isExternalLink) {
            this.storageHelper.setCookie(storageKeys.roleId, role.toString());
        }
    }

    get role() {
        return sessionStorage.getItem(storageKeys.roleId);
    }

    set loginId(loginId: string) {
        sessionStorage.setItem(storageKeys.loginId, loginId);
        if (!this.isExternalLink) {
            this.storageHelper.setCookie(storageKeys.loginId, loginId);
        }
    }

    get loginId() {
        return sessionStorage.getItem(storageKeys.loginId);
    }

    set image(image: string) {
        sessionStorage.setItem(storageKeys.image, image);
        if (!this.isExternalLink) {
            this.storageHelper.setCookie(storageKeys.image, image);
        }
    }

    get image() {
        return sessionStorage.getItem(storageKeys.image);
    }

    public logout() {
        const domain = this.storageHelper.getRootDomain();
        this.router.navigate(['/login']).then((result) => {
            if (result) {
                this.isRememberMe = false;
                localStorage.clear();
                sessionStorage.clear();
                this.cookieService.deleteAll('/', domain);
            }
        });
    }

    public isUserInfoCompleted(): boolean {
        const checkKeys = this.userInfoCookiekeys;
        let result = true;

        checkKeys.forEach(key => {
            const value = sessionStorage.getItem(key);
            if (!value) {
                result = false;
            }
        });
        return result;
    }

    public isRememberMeInfoCompleted(): boolean {
        const checkKeys = [storageKeys.id, storageKeys.isRememberMe, storageKeys.rememberMeToken];
        let result = true;

        checkKeys.forEach(key => {
            if (!this.storageHelper.checkCookie(key)) {
                result = false;
            }
        });

        if (result) {
            result = this.isRememberMe;
        }
        return result;
    }

    public copyFromCookie() {
        this.userInfoCookiekeys.forEach(key => {
            sessionStorage.setItem(key, this.storageHelper.getCookie(key));
        });
    }

    public isSignedInUserChanged() {
        if (this.storageHelper.checkCookie(storageKeys.id)) {
            const sessionUserId = sessionStorage.getItem(storageKeys.id);
            const cookieUserId = this.storageHelper.getCookie(storageKeys.id);
            return sessionUserId != null && sessionUserId !== cookieUserId;
        } else {
            return false;
        }
    }

    public isUserSignedOut() {
        return !this.storageHelper.checkCookie(storageKeys.id);
    }

    public hasUserInfoCookie(): boolean {
        let result = true;
        this.userInfoCookiekeys.forEach(key => {
            if (!this.storageHelper.checkCookie(key)) {
                result = false;
            }
        });
        return result;
    }
}
