import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'Number of items to skip from query result',
  })
  @IsInt({ message: 'Skip argument must be integer!' })
  @Min(1, { message: 'Skip must not be less then 1!' })
  page: number = 1;

  @Field(() => Int, {
    nullable: true,
    description: 'Number of items to take from query result',
  })
  @IsInt({ message: 'Take argument must be integer!' })
  @Min(1, { message: 'Take must not be less then 0!' })
  @IsOptional()
  limit: number = 10;
}
