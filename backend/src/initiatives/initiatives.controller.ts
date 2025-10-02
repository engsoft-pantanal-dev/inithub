import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto, UpdateInitiativeDto, CreateCommentDto, CreateLikeDto, ApproveInitiativeDto, CreateInitiativeUpdateDto, UpdateInitiativeUpdateDto, ChangeStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('initiatives')
@Controller('initiatives')
export class InitiativesController {
  constructor(private initiativesService: InitiativesService) {}

  // ROTAS PÚBLICAS (Leitura)
  @Get()
  @ApiOperation({ summary: 'Get all initiatives' })
  findAll(
    @Query('categories') categories?: string,
    @Query('statuses') statuses?: string,
    @Query('sort') sort?: string,
  ) {
    const categoriesArr = categories ? categories.split(',').filter(Boolean) : undefined;
    const statusesArr = statuses ? statuses.split(',').filter(Boolean) : undefined;

    return this.initiativesService.findAll({
      categories: categoriesArr,
      statuses: statusesArr,
      sort,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get initiative by id' })
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(id);
  }

  // --- ROTAS PROTEGIDAS (Ações do Usuário) ---

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create initiative (requires token)' })
  create(@Body() createInitiativeDto: CreateInitiativeDto, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.create(createInitiativeDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update initiative (requires token)' })
  update(@Param('id') id: string, @Body() updateInitiativeDto: UpdateInitiativeDto, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.update(id, updateInitiativeDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete initiative (requires token)' })
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.remove(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/like')
  @ApiOperation({ summary: 'Add like to initiative (requires token)' })
  addLike(@Param('id') initiativeId: string, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.addLike(initiativeId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/like')
  @ApiOperation({ summary: 'Remove like from initiative (requires token)' })
  removeLike(@Param('id') initiativeId: string, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.removeLike(initiativeId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to initiative (requires token)' })
  addComment(@Param('id') initiativeId: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.addComment(initiativeId, createCommentDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Remove comment from initiative (requires token)' })
  removeComment(@Param('id') initiativeId: string, @Param('commentId') commentId: string, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.removeComment(initiativeId, commentId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/updates')
  @ApiOperation({ summary: 'Add execution update to initiative (requires token)' })
  addUpdate(@Param('id') initiativeId: string, @Body() dto: CreateInitiativeUpdateDto, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.addUpdate(initiativeId, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('updates/:updateId')
  @ApiOperation({ summary: 'Update an initiative update (requires token)' })
  updateUpdate(@Param('updateId') updateId: string, @Body() dto: UpdateInitiativeUpdateDto, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.updateUpdate(updateId, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('updates/:updateId')
  @ApiOperation({ summary: 'Delete an initiative update (requires token)' })
  deleteUpdate(@Param('updateId') updateId: string, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.deleteUpdate(updateId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/:status')
  @ApiOperation({ summary: 'Change initiative status (requires token)' })
  changeStatusByParam(@Param('id') id: string, @Param('status') status: string, @Body() body: { assignedToId?: string }, @Request() req) {
    const userId = req.user.id;
    return this.initiativesService.changeStatus(id, {
      status: status.toUpperCase() as any,
      assignedToId: body?.assignedToId,
      assignedById: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/authored')
  @ApiOperation({ summary: 'Get initiatives created by the current user (requires token)' })
  findMyAuthoredInitiatives(@Request() req) {
    const userId = req.user.id;
    return this.initiativesService.findByAuthor(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/assigned')
  @ApiOperation({ summary: 'Get initiatives assigned to the current user (requires token)' })
  findMyAssignedInitiatives(@Request() req) {
    const userId = req.user.id;
    return this.initiativesService.findByAssignedTo(userId);
  }
}