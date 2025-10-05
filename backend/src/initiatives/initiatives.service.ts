import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInitiativeDto, UpdateInitiativeDto, CreateCommentDto, ChangeStatusDto, CreateInitiativeUpdateDto, UpdateInitiativeUpdateDto } from './dto';
import { EmbeddingsService } from '../embeddings/embeddings.service';

@Injectable()
export class InitiativesService {
  constructor(private prisma: PrismaService, private embeddings: EmbeddingsService) {}

  async create(data: CreateInitiativeDto, userId: string) {
    const initiative = await this.prisma.initiative.create({
      data: {
        ...data,
        authorId: userId,
      },
    });

    
    this.embeddings.generateAndStoreInitiativeEmbedding(initiative).catch(console.error);

    return initiative;
  }

  async update(id: string, data: UpdateInitiativeDto, userId: string) {
    await this._checkInitiativeOwnership(id, userId);

    return this.prisma.initiative.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string, userId: string) {
    await this._checkInitiativeOwnership(id, userId); 

    return this.prisma.$transaction([
      this.prisma.like.deleteMany({ where: { initiativeId: id } }),
      this.prisma.comment.deleteMany({ where: { initiativeId: id } }),
      this.prisma.initiativeUpdate.deleteMany({ where: { initiativeId: id } }),
      this.prisma.initiative.delete({ where: { id } }),
    ]);
  }

  async addLike(initiativeId: string, userId: string) {
    const existingLike = await this.prisma.like.findFirst({ where: { initiativeId, userId }});
    if (existingLike) {
      return existingLike;
    }
    return this.prisma.like.create({ data: { initiativeId, userId } });
  }

  async removeLike(initiativeId: string, userId: string) {
    const like = await this.prisma.like.findFirst({ where: { initiativeId, userId } });
    if (!like) throw new NotFoundException('Like not found for this user and initiative.');

    return this.prisma.like.delete({ where: { id: like.id } });
  }

  async addComment(initiativeId: string, data: CreateCommentDto, userId: string) {
    return this.prisma.comment.create({
      data: {
        content: data.content,
        initiativeId: initiativeId,
        userId: userId,
      },
    });
  }

  async removeComment(initiativeId: string, commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments.');
    }
    return this.prisma.comment.delete({ where: { id: commentId } });
  }

  async addUpdate(initiativeId: string, data: CreateInitiativeUpdateDto, userId: string) {

    await this._checkInitiativeOwnership(initiativeId, userId);

    return this.prisma.initiativeUpdate.create({
      data: {
        initiativeId: initiativeId,
        authorId: userId, 
        content: data.content,
      },
    });
  }

  async updateUpdate(updateId: string, data: UpdateInitiativeUpdateDto, userId: string) {
    const update = await this.prisma.initiativeUpdate.findUnique({ where: { id: updateId } });
    if (!update) throw new NotFoundException('Update not found');
    if (update.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own updates.');
    }
    return this.prisma.initiativeUpdate.update({
      where: { id: updateId },
      data,
    });
  }

  async deleteUpdate(updateId: string, userId: string) {
    const update = await this.prisma.initiativeUpdate.findUnique({ where: { id: updateId } });
    if (!update) throw new NotFoundException('Update not found');
    if (update.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own updates.');
    }
    return this.prisma.initiativeUpdate.delete({ where: { id: updateId } });
  }
  
  async changeStatus(id: string, data: ChangeStatusDto) {
    const initiative = await this.prisma.initiative.findUnique({ where: { id } });
    if (!initiative) throw new NotFoundException('Initiative not found');

    const payload: any = { status: data.status as any };

    if (data.status === 'IN_EXECUTION' && data.assignedToId && data.assignedById) {
      payload.assignedToId = data.assignedToId;
      payload.assignedById = data.assignedById; // O ID vem do controller (usuário logado)
      payload.assignedAt = new Date();
    }
    
    return this.prisma.initiative.update({ where: { id }, data: payload });
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

  // --- MÉTODO PRIVADO AUXILIAR ---

  private async _checkInitiativeOwnership(initiativeId: string, userId: string) {
    const initiative = await this.prisma.initiative.findUnique({
      where: { id: initiativeId },
      select: { authorId: true },
    });

    if (!initiative) {
      throw new NotFoundException('Initiative not found');
    }
    if (initiative.authorId !== userId) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }
  }
}