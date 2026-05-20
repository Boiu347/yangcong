import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as mammoth from 'mammoth';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
import { AiService, VOCItem } from './ai.service';

const AUDIO_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'audio/ogg',
  'audio/flac',
  'audio/webm',
  'video/mp4',
  'video/webm',
  'video/mpeg',
]);

const DOCUMENT_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'txt',
  'md',
]);

@Controller('api/ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('transcribe')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (AUDIO_MIME_TYPES.has(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Unsupported audio/video type: ${file.mimetype}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async transcribe(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ text: string; vocList: VOCItem[] }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(
      `Transcribe request: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`,
    );

    const text = await this.aiService.transcribeAudio(
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    const vocList = await this.aiService.extractVOCs(text);

    return { text, vocList };
  }

  @Post('parse-document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const ext = file.originalname.split('.').pop()?.toLowerCase() ?? '';
        if (DOCUMENT_EXTENSIONS.has(ext)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Unsupported document type: .${ext}`,
            ),
            false,
          );
        }
      },
    }),
  )
  async parseDocument(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ text: string; vocList: VOCItem[] }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.logger.log(
      `Parse document request: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`,
    );

    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? '';
    let text: string;

    if (ext === 'docx' || ext === 'doc') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else if (ext === 'pdf') {
      const result = await pdfParse(file.buffer);
      text = result.text;
    } else {
      text = file.buffer.toString('utf-8');
    }

    this.logger.log(`Document parsed: ${text.length} chars from .${ext} file`);

    if (!text || text.trim().length === 0) {
      throw new BadRequestException('文档内容为空，无法提取VOC数据');
    }

    const vocList = await this.aiService.extractVOCs(text);

    return { text, vocList };
  }

  @Post('extract-vocs')
  async extractVocs(
    @Body() body: { text: string },
  ): Promise<{ vocList: VOCItem[] }> {
    if (!body.text || typeof body.text !== 'string') {
      throw new BadRequestException('Request body must contain a "text" string');
    }

    this.logger.log(
      `Extract VOCs request: ${body.text.length} chars`,
    );

    const vocList = await this.aiService.extractVOCs(body.text);
    return { vocList };
  }

  @Post('generate-report')
  async generateReport(
    @Body() body: { vocItems: VOCItem[] },
  ): Promise<Record<string, { coreFindings: string[]; typicalAttitudes: string[]; strengths: string[]; painPoints: string[] }>> {
    if (!body.vocItems || !Array.isArray(body.vocItems)) {
      throw new BadRequestException('Request body must contain a "vocItems" array');
    }

    this.logger.log(`Generate report request: ${body.vocItems.length} VOC items`);
    return this.aiService.generateBrandReport(body.vocItems);
  }

  @Post('generate-summary')
  async generateSummary(
    @Body() body: { vocItems: VOCItem[]; projectName: string },
  ): Promise<{ coreFindings: string[]; actionItems: string[]; methodology: string }> {
    if (!body.vocItems || !Array.isArray(body.vocItems)) {
      throw new BadRequestException('Request body must contain a "vocItems" array');
    }

    this.logger.log(`Generate summary request: ${body.vocItems.length} VOC items for "${body.projectName}"`);
    return this.aiService.generateProjectSummary(body.vocItems, body.projectName || '未命名项目');
  }
}
