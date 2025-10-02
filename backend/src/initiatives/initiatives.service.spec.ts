import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { CreateInitiativeDto, UpdateInitiativeDto, CreateCommentDto } from './dto';

describe('InitiativesService', () => {
  let service: InitiativesService;
  
  const mockPrismaService = {
    initiative: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    like: {
      create: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(), 
    },
    comment: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(), 
    },
    initiativeUpdate: {
      deleteMany: jest.fn(), 
    },
    $transaction: jest.fn(), 
  };

  const mockEmbeddingsService = {
    generateAndStoreInitiativeEmbedding: jest.fn(),
  };

  const mockInitiative = {
    id: '1',
    title: 'Test Initiative',
    authorId: 'user1',
  };

  const currentUserId = 'user1'; 
  const anotherUserId = 'user2'; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitiativesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmbeddingsService, useValue: mockEmbeddingsService },
      ],
    }).compile();

    service = module.get<InitiativesService>(InitiativesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an initiative with the correct authorId', async () => {
      const createDto: CreateInitiativeDto = { title: 'New Initiative' } as any;
      
      mockPrismaService.initiative.create.mockResolvedValue({ ...createDto, authorId: currentUserId });
      
      mockEmbeddingsService.generateAndStoreInitiativeEmbedding.mockResolvedValue(undefined);

      const result = await service.create(createDto, currentUserId);

      expect(mockPrismaService.initiative.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          authorId: currentUserId, // Verifica se o ID do usuário foi passado corretamente
        },
      });
      expect(result.authorId).toBe(currentUserId);
    });
  });

  describe('update', () => {
    it('should update an initiative if the user is the owner', async () => {
      const updateDto: UpdateInitiativeDto = { title: 'Updated Title' };
      mockPrismaService.initiative.findUnique.mockResolvedValue(mockInitiative);
      mockPrismaService.initiative.update.mockResolvedValue({ ...mockInitiative, ...updateDto });

      const result = await service.update(mockInitiative.id, updateDto, currentUserId);

      expect(mockPrismaService.initiative.findUnique).toHaveBeenCalledWith({
        where: { id: mockInitiative.id },
        select: { authorId: true },
      });
      expect(mockPrismaService.initiative.update).toHaveBeenCalledWith({
        where: { id: mockInitiative.id },
        data: updateDto,
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw ForbiddenException if the user is not the owner', async () => {
      const updateDto: UpdateInitiativeDto = { title: 'Updated Title' };
      mockPrismaService.initiative.findUnique.mockResolvedValue(mockInitiative);

      await expect(service.update(mockInitiative.id, updateDto, anotherUserId)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if initiative does not exist', async () => {
        mockPrismaService.initiative.findUnique.mockResolvedValue(null);
        await expect(service.update('non-existent-id', {}, currentUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an initiative and its relations if the user is the owner', async () => {
        mockPrismaService.initiative.findUnique.mockResolvedValue(mockInitiative);
        mockPrismaService.$transaction.mockResolvedValue([/* mock results */]);

        await service.remove(mockInitiative.id, currentUserId);

        expect(mockPrismaService.initiative.findUnique).toHaveBeenCalledWith({
            where: { id: mockInitiative.id },
            select: { authorId: true },
        });
        expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if the user is not the owner', async () => {
        mockPrismaService.initiative.findUnique.mockResolvedValue(mockInitiative);
        await expect(service.remove(mockInitiative.id, anotherUserId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('addLike', () => {
    it('should add a like with the correct userId', async () => {
      mockPrismaService.like.findFirst.mockResolvedValue(null); // Simula que o like não existe
      mockPrismaService.like.create.mockResolvedValue({ initiativeId: '1', userId: currentUserId });

      await service.addLike('1', currentUserId);

      expect(mockPrismaService.like.create).toHaveBeenCalledWith({
        data: { initiativeId: '1', userId: currentUserId },
      });
    });
  });

  describe('removeLike', () => {
    it('should remove a like with the correct userId', async () => {
        const mockLike = { id: 'like1', initiativeId: '1', userId: currentUserId };
        mockPrismaService.like.findFirst.mockResolvedValue(mockLike);
        
        await service.removeLike('1', currentUserId);

        expect(mockPrismaService.like.findFirst).toHaveBeenCalledWith({ where: { initiativeId: '1', userId: currentUserId }});
        expect(mockPrismaService.like.delete).toHaveBeenCalledWith({ where: { id: mockLike.id } });
    });
  });

  describe('addComment', () => {
    it('should add a comment with the correct userId', async () => {
      const commentDto: CreateCommentDto = { content: 'A new comment' };
      mockPrismaService.comment.create.mockResolvedValue({ ...commentDto, userId: currentUserId });

      await service.addComment('1', commentDto, currentUserId);

      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: {
          content: commentDto.content,
          initiativeId: '1',
          userId: currentUserId,
        },
      });
    });
  });

  describe('removeComment', () => {
    it('should remove a comment if the user is the owner', async () => {
        const mockComment = { id: 'c1', userId: currentUserId };
        mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

        await service.removeComment('1', 'c1', currentUserId);
        
        expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({ where: { id: 'c1' }});
    });

    it('should throw ForbiddenException if user is not the comment owner', async () => {
        const mockComment = { id: 'c1', userId: anotherUserId };
        mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

        await expect(service.removeComment('1', 'c1', currentUserId)).rejects.toThrow(ForbiddenException);
    });
  });

});