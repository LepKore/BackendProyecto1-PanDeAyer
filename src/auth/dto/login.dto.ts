import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@universidad.edu' })
  @IsEmail()
  email!: string;

  // Sin reglas de longitud: esas aplican al CREAR la clave, no al ingresar con ella
  @ApiProperty({ example: 'Secret123!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
