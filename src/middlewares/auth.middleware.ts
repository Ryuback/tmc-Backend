import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as fbAdmin from 'firebase-admin';
import { apiEnv } from '../../enviroments/api-env';
import { User } from '../../models/user.model';
import { UserService } from '../user/user.service';

interface IAuthContext {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  private fbAdminApp: fbAdmin.app.App;
  private unitTest = process.env.UNIT_TEST;

  constructor(private userService: UserService) {
    if (!this.unitTest) {
      this.fbAdminApp = fbAdmin.initializeApp({
        projectId: apiEnv.firebase.projectId
      });
    }
  }

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization;
    let idToken: fbAdmin.auth.DecodedIdToken;
    if (token != null && token != '') {
      idToken = await this.fbAdminApp.auth()
        .verifyIdToken(token.substr(7)) // 'Bearer ...'
        .catch(err => {
          console.log('#> FirebaseMiddleware.invalid-token:', err.errorInfo);
          throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        });
    } else {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const user = await this.getOrCreateUser(idToken);
    req['authContext'] = { user } as IAuthContext;
    return next();
  }

  private async getOrCreateUser(idToken: fbAdmin.auth.DecodedIdToken): Promise<User> {
    let user: User = await this.userService.findById(idToken.uid);
    if (!user) {
      console.log('FirebaseMiddleware: creating new user:', idToken.uid);
      const givenName = (idToken.name || '').split(' ')[0];
      user = await this.userService.create(idToken.uid, idToken.name, givenName, idToken.email, idToken.email_verified);
      // await this.spaceService.create(user, UsagePlanId.TRIAL);
    }
    return user;
  }
}
