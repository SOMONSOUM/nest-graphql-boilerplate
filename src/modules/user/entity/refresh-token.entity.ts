import { BaseEntity } from '@/shared/entities';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
@Index(['expiresAt'])
@Index(['token'], { unique: true })
@Index(['token', 'revoked', 'expiresAt'])
export class RefreshToken extends BaseEntity {
  @Column({ name: 'token' })
  token: string;

  @Column({ default: false, name: 'revoked' })
  revoked: boolean;

  @Column({ type: 'timestamp', name: 'revoked_at', nullable: true })
  revokedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
