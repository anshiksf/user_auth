import {inject} from '@loopback/core';
import {FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import {User} from './models';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.USER_AUTH_ACTION)
    protected authenticationRequest: AuthenticateFn<User>
  ) { }

  async handle(context: RequestContext): Promise<void> {
    try {
      const {request, response} = context
      const route = this.findRoute(request)

      const args = await this.parseParams(request, route)
      const result = await this.invoke(route, args)
      this.send(response, result)
    } catch (err) {
      this.reject(context, err)
    }
  }
}

// export class MySequence extends MiddlewareSequence { }
