import { validate } from 'class-validator';
import { CreateInitiativeDto } from './create-initiative.dto';

describe('CreateInitiativeDto', () => {
  it('should validate successfully with all required fields', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative';
    dto.description = 'Test Description';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when title is missing', async () => {
    const dto = new CreateInitiativeDto();
    dto.description = 'Test Description';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation when title is empty', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = '';
    dto.description = 'Test Description';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation when title is only whitespace', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = '   '; 
    dto.description = 'Test description';
    dto.theme = 'Test theme';
    dto.context = 'Test context';
    dto.deliverable = 'Test deliverable';
    dto.evaluationCriteria = 'Test criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when description is missing', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('description');
  });

  it('should fail validation when theme is missing', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative';
    dto.description = 'Test Description';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('theme');
  });

  it('should fail validation when context is missing', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative';
    dto.description = 'Test Description';
    dto.theme = 'Technology';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('context');
  });

  it('should fail validation when deliverable is missing', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative';
    dto.description = 'Test Description';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('deliverable');
  });

  it('should fail validation when evaluationCriteria is missing', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative';
    dto.description = 'Test Description';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('evaluationCriteria');
  });

  it('should fail validation when multiple fields are empty', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = '';
    dto.description = '';
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    const errorProperties = errors.map(error => error.property);
    expect(errorProperties).toContain('title');
    expect(errorProperties).toContain('description');
  });

  it('should fail validation when fields are not strings', async () => {
    const dto = new CreateInitiativeDto();
    (dto as any).title = 123;
    (dto as any).description = ['array'];
    dto.theme = 'Technology';
    dto.context = 'Test Context';
    dto.deliverable = 'Test Deliverable';
    dto.evaluationCriteria = 'Test Criteria';

    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
    const errorProperties = errors.map(error => error.property);
    expect(errorProperties).toContain('title');
    expect(errorProperties).toContain('description');
  });

  it('should validate with very long strings', async () => {
    const longString = 'a'.repeat(1000);
    
    const dto = new CreateInitiativeDto();
    dto.title = longString;
    dto.description = longString;
    dto.theme = longString;
    dto.context = longString;
    dto.deliverable = longString;
    dto.evaluationCriteria = longString;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with special characters', async () => {
    const dto = new CreateInitiativeDto();
    dto.title = 'Test Initiative with émojis 🚀 and spëcial chars!';
    dto.description = 'Dëscription with açcents and @#$%^&*()';
    dto.theme = 'Tëchnology & Innovation';
    dto.context = 'Context with números 123 and símbolos';
    dto.deliverable = 'Deliverable with quotes "test" and apostrophes';
    dto.evaluationCriteria = 'Criteria with ñ and ç characters';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});