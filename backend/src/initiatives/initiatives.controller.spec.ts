import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, CanActivate } from '@nestjs/common'; 
import { InitiativesController } from './initiatives.controller';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

describe('InitiativesController', () => {
  let controller: InitiativesController;
  let initiativesService: InitiativesService;

  const mockInitiative = {
    id: '1',
    title: 'Test Initiative',
    description: 'Test Description',
    authorId: 'user1',
  };

  const mockUser = { id: 'user1', email: 'test@example.com' };
  const mockRequest = { user: mockUser };

  const mockInitiativesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  
  const mockJwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitiativesController],
      providers: [
        {
          provide: InitiativesService,
          useValue: mockInitiativesService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<InitiativesController>(InitiativesController);
    initiativesService = module.get<InitiativesService>(InitiativesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new initiative', async () => {
      const createInitiativeDto: CreateInitiativeDto = {
        title: 'Test Initiative',
        description: 'Test Description',
        theme: 'Technology',
        context: 'Test Context',
        deliverable: 'Test Deliverable',
        evaluationCriteria: 'Test Criteria',
      };

      mockInitiativesService.create.mockResolvedValue(mockInitiative);

      const result = await controller.create(createInitiativeDto, mockRequest);

      expect(result).toEqual(mockInitiative);
      expect(mockInitiativesService.create).toHaveBeenCalledWith(createInitiativeDto, mockRequest.user.id);
    });

    it('should handle validation errors', async () => {
      const invalidDto = {} as CreateInitiativeDto;
      mockInitiativesService.create.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.create(invalidDto, mockRequest)).rejects.toThrow('Validation failed');
      expect(mockInitiativesService.create).toHaveBeenCalledWith(invalidDto, mockRequest.user.id);
    });
  });

  describe('findAll', () => {
    it('should return all initiatives without filters', async () => {
        const initiatives = [mockInitiative];
        mockInitiativesService.findAll.mockResolvedValue(initiatives);
        const result = await controller.findAll(undefined, undefined, undefined);
        expect(result).toEqual(initiatives);
        expect(mockInitiativesService.findAll).toHaveBeenCalledWith({
            categories: undefined,
            statuses: undefined,
            sort: undefined,
        });
    });
  });

  describe('findOne', () => {
    it('should return an initiative when found', async () => {
        mockInitiativesService.findOne.mockResolvedValue(mockInitiative);
        const result = await controller.findOne('1');
        expect(result).toEqual(mockInitiative);
        expect(mockInitiativesService.findOne).toHaveBeenCalledWith('1');
    });
    it('should throw NotFoundException when initiative not found', async () => {
        mockInitiativesService.findOne.mockRejectedValue(new NotFoundException('Initiative not found'));
        await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an initiative successfully', async () => {
      const updateInitiativeDto: UpdateInitiativeDto = { title: 'Updated Initiative' };
      const updatedInitiative = { ...mockInitiative, ...updateInitiativeDto };
      mockInitiativesService.update.mockResolvedValue(updatedInitiative);

      const result = await controller.update('1', updateInitiativeDto, mockRequest);

      expect(result).toEqual(updatedInitiative);
      expect(mockInitiativesService.update).toHaveBeenCalledWith('1', updateInitiativeDto, mockRequest.user.id);
    });
  });

  describe('remove', () => {
    it('should delete an initiative successfully', async () => {
      mockInitiativesService.remove.mockResolvedValue(mockInitiative);

      const result = await controller.remove('1', mockRequest);

      expect(result).toEqual(mockInitiative);
      expect(mockInitiativesService.remove).toHaveBeenCalledWith('1', mockRequest.user.id);
    });
  });
});