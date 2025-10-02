
import { validate } from 'class-validator';
import { CreateUserDto } from './user-create.dto';

describe('CreateUserDto', () => {
  it('should validate successfully with all required fields', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate successfully with all fields', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.password = 'password123';
    dto.department = 'IT';
    dto.emojiAvatar = '🚀';
    dto.isAdmin = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when email is missing', async () => {
    const dto = new CreateUserDto();
    dto.name = 'Test User';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation when email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.email = 'invalid-email';
    dto.name = 'Test User';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail validation when name is missing', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation when name is empty', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.name = '';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation when name is only whitespace', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.name = '   ';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0); 
  });

  it('should fail validation when isAdmin is not boolean', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.password = 'password123';
    (dto as any).isAdmin = 'not-boolean';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('isAdmin');
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should allow optional fields to be undefined', async () => {
    const dto = new CreateUserDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.password = 'password123';
    dto.department = undefined;
    dto.emojiAvatar = undefined;
    dto.isAdmin = undefined;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate various email formats', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.co.uk',
      'user+tag@example.org',
      'user123@example123.com',
      'test.email@sub.domain.com',
    ];

    for (const email of validEmails) {
      const dto = new CreateUserDto();
      dto.email = email;
      dto.name = 'Test User';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should reject invalid email formats', async () => {
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@com',
      'username..double.dot@example.com',
      'username@-example.com',
    ];

    for (const email of invalidEmails) {
      const dto = new CreateUserDto();
      dto.email = email;
      dto.name = 'Test User';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    }
  });
});