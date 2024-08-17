export class InvalidPasswordResetRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPasswordResetRequest';
  }
}
