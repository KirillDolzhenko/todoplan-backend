import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignUpDto extends LogInDto {
  @IsNotEmpty()
  username: string;
}
