import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class SignupController {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'Signup reponse',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User
            }
          }
        }
      }
    }
  })
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              email: {type: 'string'},
              password: {type: 'string'},
              address: {type: 'string'}
            }
          }
        }
      }
    })
    signupRequest: {name: string, email: string, password: string, address: string}
  ): Promise<User> {
    const {name, email, password, address} = signupRequest
    const createdUser = await this.userRepository.create({
      name,
      email,
      password,
      address
    })

    return createdUser
  }
}
