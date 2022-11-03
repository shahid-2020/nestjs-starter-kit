import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { EntityRepository } from '../../custom-typeorm/decorators/entity-repository.decorator';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: Partial<User>): Promise<User> {
    const newUser = this.create(user);
    await this.save(newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const result = await this.update(id, user);
    if (result.affected <= 0) {
      return null;
    }
    const updatedUser = await this.findOneBy({ id });
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.findOneBy({ id });
    const result = await this.softDelete({ id });
    if (result.affected <= 0) {
      return null;
    }
    return user;
  }
}
