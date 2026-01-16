import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('value')
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  @Post('events')
  async getEvents(
    @Body() body: GetEventsDto,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.blockchainService.getValueUpdatedEvents(
      body.fromBlock,
      body.toBlock,
      pagination.page,
      pagination.limit,
    );
  }
}
