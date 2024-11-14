import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  password: string;
}

export class SignUpDto extends LogInDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(50)
  password: string;
}
