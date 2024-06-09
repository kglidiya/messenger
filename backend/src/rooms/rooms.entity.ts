import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

interface IParticipants {
  userId: string;
  addedOn: number;
  isDeleted: boolean;
}
@Entity({ name: 'rooms' })
export class RoomsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usersId: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: null })
  avatar: string;

  @Column('jsonb', { default: [] })
  admin?: string[];

  @Column('jsonb', { default: [] })
  participants?: IParticipants[];
}
