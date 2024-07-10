import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {AuthenticationServiceComponent, AuthorizationBindings} from '@sourceloop/authentication-service';
import {BearerVerifierBindings, BearerVerifierComponent, BearerVerifierConfig, BearerVerifierType, SecureSequence} from '@sourceloop/core';
import {AuthorizationComponent} from 'loopback4-authorization';
import path from 'path';

export {ApplicationConfig};

export class UserAuthApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.component(AuthenticationServiceComponent)
    this.sequence(SecureSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
    } as BearerVerifierConfig);

    this.component(BearerVerifierComponent)
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/login', '/signup'],
    });
    this.component(AuthorizationComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
