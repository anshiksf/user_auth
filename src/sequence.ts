import {inject} from '@loopback/core';
import {FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import {AuthClient, AuthorizationBindings} from '@sourceloop/authentication-service';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizeFn, UserPermissionsFn} from 'loopback4-authorization';
import {User} from './models';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticationRequest: AuthenticateFn<User>,

    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthClient>,
    @inject(AuthorizationBindings.AUTHORIZE_ACTION)
    protected checkAuthorisation: AuthorizeFn,
    @inject(AuthorizationBindings.USER_PERMISSIONS)
    private readonly getUserPermissions: UserPermissionsFn<string>,
  ) { }

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context
      const route = this.findRoute(request)

      await this.authenticationRequest(request);

      const args = await this.parseParams(request, route)
      const result = await this.invoke(route, args)
      this.send(response, result)
    } catch (err) {
      this.reject(context, err)
    }
  }
}

// export class MySequence extends MiddlewareSequence { }
