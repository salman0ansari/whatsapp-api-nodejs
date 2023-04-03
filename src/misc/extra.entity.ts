import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(["DBId", "key"])
export class Extra {
    @PrimaryGeneratedColumn()
    DBId: number;

    @Column()
    key: string;

    @Column()
    qr: string;

    @Column()
    webhook: string;
}