import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import * as jwt from "jsonwebtoken";
import {UserRepository} from '../repositories';

export class LoginController {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository
  ) { }

  @post('/login', {
    responses: {
      '200': {
        description: 'Login response',
        content: {
          'application/json': {
            schema: {
              type: 'object'
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {type: 'string'},
              password: {type: 'string'}
            }
          }
        }
      }
    })
    creds: {email: string, password: string}
  ): Promise<{token: string}> {
    const {email, password} = creds

    const user = await this.userRepository.findOne({
      where: {email}
    })

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email or password')
    }

    const isPasswordMacthed = await this.verifyPassword(password, user.password)
    if (!isPasswordMacthed) {
      throw new HttpErrors.Unauthorized('Invalid email or password')
    }

    const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET!, {expiresIn: '1h'})

    return {token}
  }

  private async verifyPassword(enteredPassword: string, storedPassword: string) {
    return enteredPassword === storedPassword
  }
}
