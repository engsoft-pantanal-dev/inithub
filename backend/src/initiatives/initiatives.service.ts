import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInitiativeDto, UpdateInitiativeDto, CreateCommentDto, CreateLikeDto, ApproveInitiativeDto, CreateInitiativeUpdateDto, UpdateInitiativeUpdateDto, ChangeStatusDto } from './dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class InitiativesService {
  constructor(private prisma: PrismaService, private embeddings: EmbeddingsService) {}

  async create(data: CreateInitiativeDto) {
    const { ...rest } = data as any;
    const created = await this.prisma.initiative.create({
      data: {
        ...rest,
        assignedToId: undefined,
        assignedById: undefined,
        assignedAt: undefined,
      },
    });
    this.embeddings.generateAndStoreInitiativeEmbedding(created).catch(() => {
      // Swallow errors to avoid blocking the request path
    });

    return created;
  }

  async findAll(filters?: {
    categories?: string[];
    statuses?: string[];
    sort?: string | undefined;
  }) {
    const where: any = {};

    if (filters?.categories && filters.categories.length > 0) {
      where.OR = filters.categories.map((c) => ({ theme: { contains: c, mode: 'insensitive' } }));
    }
    if (filters?.statuses && filters.statuses.length > 0) {
      where.status = { in: filters.statuses as any };
    }

    const orderBy: any = {};
    if (filters?.sort) {
      switch (filters.sort) {
        case 'likes_desc':
          orderBy.likes = { _count: 'desc' };
          break;
        case 'likes_asc':
          orderBy.likes = { _count: 'asc' };
          break;
        case 'createdAt_asc':
          orderBy.createdAt = 'asc';
          break;
        case 'createdAt_desc':
        default:
          orderBy.createdAt = 'desc';
          break;
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    return this.prisma.initiative.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedBy: { 
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, name: true, emojiAvatar: true },
            },
          },
        },
        updates: {
          select: {
            id: true,
            content: true,
            isCompleted: true,
            createdAt: true,
            author: {
              select: { id: true, name: true, emojiAvatar: true },
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const initiative = await this.prisma.initiative.findUnique({
      where: { id },
      include: {
        likes: true,
        comments: {
          include: {
            user: true,
          },
        },
        updates: { 
          orderBy: { createdAt: 'desc' },
          include: {
            author: true,
          },
        },
        author: true,
        assignedTo: true,
        assignedBy: true,
      },
    });
    
    if (!initiative) throw new NotFoundException('Initiative not found');
    return initiative;
  }

  async update(id: string, data: UpdateInitiativeDto) {
    // Map DTO status to Prisma enum value if provided
    const { status, assignedAt, ...rest } = data as any;
    const payload: any = { ...rest };
    if (typeof assignedAt === 'string') {
      payload.assignedAt = new Date(assignedAt);
    }
    if (status) {
      // Prisma expects the generated enum type; using string is fine as long as it matches
      payload.status = status as any;
    }
    
    const updated = await this.prisma.initiative.update({
      where: { id },
      data: payload,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedBy: { 
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, name: true, emojiAvatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        updates: {
          select: {
            id: true,
            content: true,
            isCompleted: true,
            createdAt: true,
            author: {
              select: { id: true, name: true, emojiAvatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const contentFields = ['title', 'description', 'theme', 'context', 'deliverable', 'evaluationCriteria'];
    const hasContentUpdate = contentFields.some(field => payload[field] !== undefined);
    
    if (hasContentUpdate) {
      this.embeddings.generateAndStoreInitiativeEmbedding(updated).catch((error) => {
        console.error('Failed to update embeddings for initiative:', id, error);
        // Swallow errors to avoid blocking the request path
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
  }

  async addLike(initiativeId: string, data: CreateLikeDto) {
    const { userId } = data;
    if (!userId) throw new BadRequestException('userId is required');
    return this.prisma.like.create({ data: { initiativeId, userId } });
  }

  async removeLike(initiativeId: string, userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    const like = await this.prisma.like.findFirst({ where: { initiativeId, userId } });
    if (!like) throw new NotFoundException('Like not found');
    return this.prisma.like.delete({ where: { id: like.id } });
  }

  async addComment(initiativeId: string, data: CreateCommentDto) {
    const { userId, content } = data;
    if (!userId) throw new BadRequestException('userId is required');
    return this.prisma.comment.create({
      data: { content, userId, initiativeId },
    });
  }

  async removeComment(initiativeId: string, commentId: string, userId: string) {
    if (!userId) throw new BadRequestException('userId is required');
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.initiativeId !== initiativeId) throw new BadRequestException('Comment does not belong to initiative');
    if (comment.userId !== userId) throw new BadRequestException('Only the comment owner can delete the comment');
    return this.prisma.comment.delete({ where: { id: commentId } });
  }

  async addUpdate(initiativeId: string, data: CreateInitiativeUpdateDto) {
    const { authorId, content } = data;
    if (!authorId || !content) throw new BadRequestException('authorId and content are required');
    return this.prisma.initiativeUpdate.create({
      data: { initiativeId, authorId, content },
      include: {
        author: true,
      },
    });
  }

  async updateUpdate(updateId: string, data: UpdateInitiativeUpdateDto) {
    const update = await this.prisma.initiativeUpdate.findUnique({
      where: { id: updateId },
    });
    
    if (!update) throw new NotFoundException('Update not found');
    
    return this.prisma.initiativeUpdate.update({
      where: { id: updateId },
      data,
      include: {
        author: true,
      },
    });
  }

  async deleteUpdate(updateId: string) {
    const update = await this.prisma.initiativeUpdate.findUnique({
      where: { id: updateId },
    });
    
    if (!update) throw new NotFoundException('Update not found');
    
    return this.prisma.initiativeUpdate.delete({
      where: { id: updateId },
    });
  }

  async findByAuthor(userId: string) {
    return this.prisma.initiative.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedBy: { 
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                emojiAvatar: true,
                department: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        updates: {
          select: {
            id: true,
            content: true,
            isCompleted: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                emojiAvatar: true,
                department: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async findByAssignedTo(userId: string) {
    return this.prisma.initiative.findMany({
      where: {
        assignedToId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedBy: { 
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                emojiAvatar: true,
                department: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        updates: {
          select: {
            id: true,
            content: true,
            isCompleted: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                emojiAvatar: true,
                department: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
  }

  async changeStatus(id: string, data: ChangeStatusDto) {
    const initiative = await this.prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw new NotFoundException('Initiative not found');

    const payload: any = { status: data.status as any };

    if (data.status === 'IN_EXECUTION' && data.assignedToId && data.assignedById) {
      payload.assignedToId = data.assignedToId;
      payload.assignedById = data.assignedById;
      payload.assignedAt = new Date();
    }

    return this.prisma.initiative.update({
      where: { id },
      data: payload,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        assignedBy: { 
          select: {
            id: true,
            name: true,
            emojiAvatar: true,
            department: true,
          },
        },
        likes: {
          select: { userId: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: { id: true, name: true, emojiAvatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        updates: {
          select: {
            id: true,
            content: true,
            isCompleted: true,
            createdAt: true,
            author: {
              select: { id: true, name: true, emojiAvatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

}