import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from '@/shared/entities';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

export enum AuthProvider {
  MOC_DIGIKEY = 'moc_digikey',
  LOCAL = 'local',
}

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
});

@ObjectType()
@Entity({
  name: 'accounts',
})
@Unique(['authProvider', 'providerId'])
export class Account extends BaseEntity {
  @Field(() => AuthProvider, {
    nullable: false,
    defaultValue: AuthProvider.MOC_DIGIKEY,
    name: 'authProvider',
  })
  @Column({ default: AuthProvider.MOC_DIGIKEY, name: 'auth_provider' })
  authProvider: AuthProvider;

  @Field(() => Int, { nullable: true, name: 'providerId' })
  @Column({ nullable: true, name: 'provider_id', type: 'int' })
  providerId?: number;

  @Column({ nullable: true, name: 'password' })
  password?: string;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
