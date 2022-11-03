import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Providers, Roles } from '../enums/user.enum';
import { Base } from '../../../shared/entities/base.entity';

@Entity()
export class User extends Base {
  @Column({ type: 'enum', enum: Providers, default: Providers.EMAIL })
  provider: Providers;

  @Column({ unique: true, default: null })
  googleId: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true, select: false })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'enum',
    array: true,
    enum: Roles,
    default: `{${Roles.USER}}`,
  })
  roles: Roles[];
}
