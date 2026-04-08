import { Field, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '@/shared/entities';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

export enum AuthProvider {
  AAS = 'aas',
  LOCAL = 'local',
}

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
});

@Entity({
  name: 'accounts',
})
@Unique(['authProvider', 'providerId'])
export class Account extends BaseEntity {
  @Field(() => AuthProvider, {
    nullable: false,
    defaultValue: AuthProvider.AAS,
    name: 'authProvider',
  })
  @Column({ default: AuthProvider.AAS, name: 'auth_provider' })
  authProvider: AuthProvider;

  @Field(() => String, { nullable: true, name: 'providerId' })
  @Column({ nullable: true, name: 'provider_id' })
  providerId?: string;

  @Column({ nullable: true, name: 'password' })
  password?: string;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
