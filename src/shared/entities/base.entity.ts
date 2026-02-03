import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
