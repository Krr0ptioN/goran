import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class Password {
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
  })
  public readonly password: string;

  constructor(password: string) {
    this.password = password;
  }
}
