import { Field } from '@nestjs/graphql';
import { BaseEntity } from '@/shared/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { Account } from './account.entity';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Field(() => String, { nullable: false, name: 'email' })
  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Field(() => String, { nullable: true, name: 'username' })
  @Column({ nullable: true, name: 'username' })
  username?: string;

  @OneToMany(() => Account, (account) => account.user, {
    cascade: true,
  })
  accounts: Account[];
}
