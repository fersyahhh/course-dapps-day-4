import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './simple-storage.json';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    // GANTI dengan address hasil deploy Day 2
    this.contractAddress =
      '0x30bB041a81191e0f91D16a074804B94d0E7524E4' as `0x${string}`;
  }

  // 🔹 Read latest value
  async getLatestValue(): Promise<ApiResponseDto<{ value: string }>> {
    try {
      const value: bigint = (await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: 'getValue',
      })) as bigint;

      return {
        statusCode: 200,
        message: 'Latest value retrieved successfully',
        data: {
          value: value.toString(),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Read ValueUpdated events with pagination
  async getValueUpdatedEvents(
    fromBlock: number,
    toBlock: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<any[]>> {
    try {
      // Validate block range
      const blockRange = toBlock - fromBlock;
      if (blockRange < 0) {
        throw new BadRequestException(
          'toBlock must be greater than or equal to fromBlock',
        );
      }

      // RPC restriction: max 2048 blocks per request
      const MAX_BLOCKS = 2048;
      if (blockRange > MAX_BLOCKS) {
        throw new BadRequestException(
          `Block range (${blockRange}) exceeds maximum allowed (${MAX_BLOCKS}). Please use pagination.`,
        );
      }

      // Fetch events
      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [
            {
              name: 'newValue',
              type: 'uint256',
              indexed: false,
            },
          ],
        },
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      // Format events
      const formattedEvents = events.map((event) => ({
        blockNumber: event.blockNumber?.toString(),
        value: event.args.newValue?.toString(),
        txHash: event.transactionHash,
        logIndex: event.logIndex,
      }));

      // Paginate results
      const totalItems = formattedEvents.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEvents = formattedEvents.slice(startIndex, endIndex);

      return {
        statusCode: 200,
        message: 'Events retrieved successfully',
        data: paginatedEvents,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleRpcError(error);
    }
  }

  // 🔹 Centralized RPC Error Handler
  private handleRpcError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);

    console.error('RPC Error:', { error: message });

    if (message.includes('timeout')) {
      throw new ServiceUnavailableException({
        statusCode: 503,
        message: 'RPC timeout. Please try again later.',
        data: null,
        timestamp: new Date().toISOString(),
      });
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed') ||
      message.includes('ECONNREFUSED')
    ) {
      throw new ServiceUnavailableException({
        statusCode: 503,
        message: 'Unable to connect to blockchain RPC. Please try again later.',
        data: null,
        timestamp: new Date().toISOString(),
      });
    }

    throw new InternalServerErrorException({
      statusCode: 500,
      message:
        'An error occurred while reading blockchain data. Please try again.',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
