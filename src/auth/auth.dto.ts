import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class AuthBaseDto {
    /** 
     * - User's email address
     * - Must be a valid email address
     * @example "user@example.com"
    */
    @IsNotEmpty()
    @IsEmail()
    public readonly email: string;

    /**
     * - User's password
     * - Must be between 8 and 64 characters
     * - Must contain at least one uppercase letter, one lowercase letter, and one number or special character
     * @example "Secure!123, Passw0rd#, Pass word1!"
    */
    @IsNotEmpty()
    @IsString()
    @Length(8, 64, { message: 'Password must be between 8 and 64 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, and one number or special character.' }
    )
    public readonly password: string;
}