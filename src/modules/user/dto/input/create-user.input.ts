import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { name: 'email', nullable: false })
  email: string;

  @Field(() => String, { name: 'username', nullable: true })
  username: string;

  @Field(() => String, { name: 'password', nullable: false })
  password: string;
}
