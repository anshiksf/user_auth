import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {AuthDbSourceName} from '@sourceloop/authentication-service';

const config = {
  name: AuthDbSourceName,
  connector: 'postgresql',
  url: 'postgres://postgres:anshik1234@localhost/db2',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'aanshik1234',
  database: 'db2'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthDbSourceNameDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = AuthDbSourceName;
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.authDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
