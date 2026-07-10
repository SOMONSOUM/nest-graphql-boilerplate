import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@/shared/entities';
import { Column, Entity, OneToMany } from 'typeorm';
import { Account } from './account.entity';

@ObjectType()
@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Field(() => String, { nullable: false, name: 'email' })
  @Column({ unique: true, nullable: false, name: 'email' })
  email: string;

  @Field(() => Boolean, { nullable: false, name: 'isActive' })
  @Column({ nullable: false, name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => String, { nullable: true, name: 'profileUrl' })
  @Column({ nullable: true, name: 'profile_url' })
  profileUrl?: string;

  @Field(() => String, { nullable: true, name: 'gender' })
  @Column({ nullable: true, name: 'gender' })
  gender?: string;

  @Field(() => String, { nullable: true, name: 'phoneNumber' })
  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @Field(() => String, { nullable: true, name: 'nationalId' })
  @Column({ nullable: true, name: 'national_id' })
  nationalId?: string;

  @Field(() => String, { nullable: true, name: 'dob' })
  @Column({ nullable: true, name: 'dob' })
  dob?: string;

  @Field(() => String, { nullable: true, name: 'fullNameKm' })
  @Column({ nullable: true, name: 'full_name_km' })
  fullNameKm?: string;

  @Field(() => String, { nullable: true, name: 'fullNameEn' })
  @Column({ nullable: true, name: 'full_name_en' })
  fullNameEn?: string;

  @OneToMany(() => Account, (account) => account.user, {
    cascade: true,
  })
  accounts: Account[];
}
