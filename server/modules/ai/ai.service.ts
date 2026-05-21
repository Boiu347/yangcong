import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Ffmpeg = require('fluent-ffmpeg') as typeof import('fluent-ffmpeg');
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ffmpegPath = require('ffmpeg-static');
  if (ffmpegPath) Ffmpeg.setFfmpegPath(ffmpegPath);
} catch { /* use system ffmpeg */ }

export interface VOCItem {
  id: string;
  brand: string;
  text: string;
  respondent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  dimension?: string;
  subDimension?: string;
  startTime?: number;   // seconds in source audio
  endTime?: number;     // seconds in source audio
  clipUrl?: string;     // URL to playable audio clip
  sourceFileId?: string;
}

const VOC_EXTRACTION_PROMPT = `你是一位专业的VOC（用户之声）数据分析专家。你的任务是从用户研究文档中【尽可能多地】提取所有VOC相关的数据。

## 文档结构说明
文档已被转换为带结构标记的文本：
- "#"、"##"、"###" 等开头的行是标题（对应品牌名或章节名）
- "**加粗文字**" 通常是小节标题、受访者编号或关键词
- "| 列1 | 列2 |" 格式是表格内容（表格中每个单元格可能包含用户原话）
- "- " 开头是列表项
请利用这些结构标记来准确识别品牌归属和用户原话边界。

## 重要
文档中通常按品牌分节（如标题"万物指南"下面就是关于万物指南的所有用户反馈），你需要逐段逐句地扫描每个品牌下的所有内容，不要遗漏任何一条用户表述。表格中的内容也要逐行扫描，每个单元格都可能包含独立的用户原话。

## 品牌枚举（brand字段只能填以下之一）
- 洋葱
- 妙懂
- 万物指南（物理十分通）（文本中提到"物理十分通"或"万物指南"都算这个品牌）
- NB虚拟实验室（NoBook）（文本中提到"NoBook"、"nobook"、"NB"都算这个品牌）
- 学而思
- 叫叫
- 赛先生科学课（文本中提到"赛先生"就算这个品牌）
- 南开大学AI物理课（文本中提到"南开"、"AI物理"就算这个品牌）

## 一级维度（dimension字段必须填以下三个之一，不能为空）
- 启蒙认知
- 购买决策
- 产品体验

## 二级维度（subDimension字段必须从对应一级维度下选择，不能为空）
- 启蒙认知下：「诉求是什么？」/「对启蒙的要求&态度」/「启蒙有效的标准&预期」
- 购买决策下：「触达渠道」/「吸引卖点」/「购前预期」
- 产品体验下：「使用场景」/「优势好评」/「劣势差评」

## 分类原则
- 用户谈到"为什么要给孩子学"、"希望孩子怎样"、"对教育的态度" → 启蒙认知
- 用户谈到"在哪看到的"、"什么吸引了我"、"买之前想的" → 购买决策
- 用户谈到"孩子怎么用的"、"好在哪"、"不好在哪"、"具体体验" → 产品体验

## 提取规则
1. **text字段为用户原始表述，必须从文档中逐字复制原话，不缩写、不改写、不合并、不润色**。如果原文写了"我家孩子特别喜欢看那个动画"，text就必须是"我家孩子特别喜欢看那个动画"，一个字都不能改
2. 情感倾向(sentiment)：positive（正面）/ neutral（中性）/ negative（负面）
3. respondent：如能识别出受访者编号（如加粗的编号、"受访者X"、"用户X"、表格第一列的编号等）就填，否则填空字符串
4. 每条独立表述都单独作为一条记录，同一个人说了3句话就是3条记录
5. dimension和subDimension必须填写，根据内容语义判断属于哪个维度
6. 宁可多提取也不要遗漏，文档中每个品牌下的每一段用户反馈都要提取
7. 如果用户原话出现在表格中，也要完整提取该单元格内的原话

请以JSON数组格式输出，每个对象包含：
{brand, text, respondent, sentiment, dimension, subDimension}`;

// Prompt for timestamped transcripts (audio/video files)
const VOC_EXTRACTION_PROMPT_WITH_TIMESTAMP = `你是一位专业的VOC（用户之声）数据分析专家。你的任务是从带时间戳的访谈转录文字稿中提取所有用户原声。

## 品牌枚举（brand字段只能填以下之一）
- 洋葱
- 妙懂
- 万物指南（物理十分通）
- NB虚拟实验室（NoBook）
- 学而思
- 叫叫
- 赛先生科学课
- 南开大学AI物理课

## 一级维度（dimension必须填以下三个之一）
- 启蒙认知
- 购买决策
- 产品体验

## 二级维度（subDimension从对应一级维度下选择）
- 启蒙认知：「诉求是什么？」/「对启蒙的要求&态度」/「启蒙有效的标准&预期」
- 购买决策：「触达渠道」/「吸引卖点」/「购前预期」
- 产品体验：「使用场景」/「优势好评」/「劣势差评」

## 提取规则
1. text字段必须是用户原话，逐字复制，不改写
2. 只提取受访用户说的话，不提取采访者的问题
3. startTime：该句话对应的时间戳换算为秒（[02:13] → 133）
4. 宁多勿漏

请以JSON数组格式输出，每个对象包含：
{brand, text, respondent, sentiment, dimension, subDimension, startTime}`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly aiModel: string;
  private readonly transcriptionModel: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'AI_GATEWAY_URL',
      'https://ops-ai-gateway.yc345.tv/v1',
    );
    this.apiKey = this.configService.get<string>('AI_API_KEY', '');
    this.aiModel = this.configService.get<string>(
      'AI_MODEL',
      'claude-sonnet-4-6',
    );
    this.transcriptionModel = this.configService.get<string>(
      'TRANSCRIPTION_MODEL',
      'gemini-2.5-flash',
    );
  }

  // ─── Audio helpers ────────────────────────────────────────────────────────

  /** Extract a small mono MP3 from any audio/video file using ffmpeg */
  private extractAudio(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .audioBitrate('32k')
        .audioChannels(1)
        .audioFrequency(16000)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .run();
    });
  }

  /** Cut a short clip from an audio file: [startSec-2, endSec+2] for context */
  private createClip(
    inputPath: string,
    outputPath: string,
    startSec: number,
    endSec: number,
  ): Promise<void> {
    const pad = 1.5;
    const ss = Math.max(0, startSec - pad);
    const duration = endSec - startSec + pad * 2;
    return new Promise((resolve, reject) => {
      Ffmpeg(inputPath)
        .setStartTime(ss)
        .setDuration(duration)
        .audioCodec('libmp3lame')
        .audioBitrate('64k')
        .audioChannels(1)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err: Error) => reject(err))
        .run();
    });
  }

  /** Parse "[MM:SS]" or "[HH:MM:SS]" → seconds */
  private parseTimestamp(ts: string): number {
    const parts = ts.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  }

  // ─── Transcription ────────────────────────────────────────────────────────

  async transcribeAudio(
    fileBuffer: Buffer,
    mimeType: string,
    fileName: string,
  ): Promise<string> {
    this.logger.log(`Transcribing audio file: ${fileName} (${mimeType})`);

    const base64Content = fileBuffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64Content}`;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.transcriptionModel,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `请将以下音频/视频内容转录为带时间戳的中文文字稿。

格式要求（每行一句话或一段话）：
[MM:SS] 说话人: 内容

说话人规则：
- 采访者/主持人 → 写"采访者"
- 受访用户 → 写"受访者"（如能识别出编号则写具体编号，如"受访者A"）

示例格式：
[00:05] 采访者: 您好，能介绍一下您家孩子的学习情况吗？
[00:12] 受访者: 我家孩子三年级，比较喜欢动手做实验那种...

注意：
- 时间戳精确到秒
- 完整转录所有对话，不要省略任何内容
- 只输出转录文字稿，不要其他说明`,
              },
              {
                type: 'image_url',
                image_url: { url: dataUri },
              },
            ],
          },
        ],
        max_tokens: 32768,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 300_000,
      },
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim() ?? '';
    this.logger.log(
      `Transcription complete for ${fileName}: ${text.length} chars`,
    );
    return text;
  }

  /**
   * Full pipeline for an audio/video file:
   * 1. Save raw file to disk
   * 2. Extract lightweight mono MP3 with ffmpeg
   * 3. Transcribe with timestamps
   * 4. Extract VOCs (with timestamps matched from transcript)
   * 5. Create individual audio clips per VOC
   * Returns VOC list (with clipUrl) + the audio URL
   */
  async processMediaFile(
    fileBuffer: Buffer,
    mimeType: string,
    fileName: string,
    fileId: string,
  ): Promise<{ text: string; vocList: VOCItem[]; audioUrl: string }> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const fileDir = path.join(uploadsDir, fileId);
    fs.mkdirSync(fileDir, { recursive: true });

    // 1. Save original file
    const ext = path.extname(fileName) || '.mp4';
    const originalPath = path.join(fileDir, `original${ext}`);
    fs.writeFileSync(originalPath, fileBuffer);
    this.logger.log(`Saved original file: ${originalPath}`);

    // 2. Extract low-bitrate mono MP3 for Gemini
    const audioPath = path.join(fileDir, 'audio.mp3');
    try {
      await this.extractAudio(originalPath, audioPath);
      this.logger.log(`Audio extracted: ${audioPath}`);
    } catch (err) {
      this.logger.error(`ffmpeg extraction failed: ${err}`);
      // Fallback: use original buffer directly
      fs.copyFileSync(originalPath, audioPath);
    }

    // 3. Transcribe with timestamps
    const audioBuffer = fs.readFileSync(audioPath);
    const text = await this.transcribeAudio(audioBuffer, 'audio/mpeg', fileName);

    // 4. Extract VOCs with timestamp info
    const vocList = await this.extractVOCsFromTimestampedTranscript(text, fileId);

    // 5. Create clips for VOCs that have timestamps
    const clipsDir = path.join(fileDir, 'clips');
    fs.mkdirSync(clipsDir, { recursive: true });
    await this.createVOCClips(audioPath, vocList, clipsDir, fileId);

    const audioUrl = `/uploads/${fileId}/audio.mp3`;
    return { text, vocList, audioUrl };
  }

  /** Extract VOCs from a timestamped transcript, preserving time info */
  async extractVOCsFromTimestampedTranscript(
    timestampedText: string,
    fileId?: string,
  ): Promise<VOCItem[]> {
    this.logger.log(`Extracting VOCs from timestamped transcript (${timestampedText.length} chars)`);

    const userMessage = `以下是带时间戳的用户访谈转录文字稿（格式：[MM:SS] 说话人: 内容）。

请提取所有有价值的用户原声（VOC），每条VOC必须包含 startTime 字段（该句话对应的时间戳，换算为秒数）。

时间戳换算示例：[02:13] → startTime: 133，[01:05:30] → startTime: 3930

文字稿内容：
${timestampedText}`;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.aiModel,
        messages: [
          { role: 'system', content: VOC_EXTRACTION_PROMPT_WITH_TIMESTAMP },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 32768,
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 180_000,
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim() ?? '[]';
    const parsed = this.parseJsonFromResponse(raw);

    const vocItems: VOCItem[] = parsed.map((item: Record<string, unknown>) => {
      const startTime = typeof item.startTime === 'number' ? item.startTime : undefined;
      // Estimate endTime: startTime + average 10s per quote
      const endTime = startTime !== undefined ? startTime + 12 : undefined;
      return {
        id: randomUUID(),
        brand: String(item.brand ?? ''),
        text: String(item.text ?? ''),
        respondent: String(item.respondent ?? ''),
        sentiment: this.normalizeSentiment(item.sentiment),
        dimension: item.dimension ? String(item.dimension) : undefined,
        subDimension: item.subDimension ? String(item.subDimension) : undefined,
        startTime,
        endTime,
        sourceFileId: fileId,
      };
    });

    this.logger.log(`Extracted ${vocItems.length} VOC items with timestamps`);
    return vocItems;
  }

  /** Create individual MP3 clips for each VOC that has a startTime */
  async createVOCClips(
    audioPath: string,
    vocItems: VOCItem[],
    clipsDir: string,
    fileId: string,
  ): Promise<void> {
    const withTimestamps = vocItems.filter(v => v.startTime !== undefined);
    this.logger.log(`Creating ${withTimestamps.length} audio clips...`);

    for (const voc of withTimestamps) {
      const clipPath = path.join(clipsDir, `${voc.id}.mp3`);
      try {
        await this.createClip(audioPath, clipPath, voc.startTime!, voc.endTime ?? voc.startTime! + 12);
        voc.clipUrl = `/uploads/${fileId}/clips/${voc.id}.mp3`;
      } catch (err) {
        this.logger.warn(`Failed to create clip for VOC ${voc.id}: ${err}`);
      }
    }
    this.logger.log(`Clips created in ${clipsDir}`);
  }

  /** Extract VOCs from a single text chunk (≤ CHUNK_SIZE chars) */
  private async extractVOCsFromChunk(
    textContent: string,
    chunkIndex: number,
    totalChunks: number,
  ): Promise<VOCItem[]> {
    const userMessage = `以下是用户研究文档的内容${totalChunks > 1 ? `（第${chunkIndex + 1}/${totalChunks}段）` : ''}。请逐条提取VOC。

注意：
- 文档中 # / ## / ### 标记的是标题，用于区分品牌或章节
- **加粗** 的文字通常是受访者编号或小节标题
- "| xxx | yyy |" 格式是表格行，每列都可能含有用户原话
- 请从文档原文中逐字复制用户原话到text字段，不要概括或改写

文档内容：
${textContent}`;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.aiModel,
        messages: [
          { role: 'system', content: VOC_EXTRACTION_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 16384,
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120_000,
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim() ?? '[]';
    const parsed = this.parseJsonFromResponse(raw);

    return parsed.map((item: Record<string, unknown>) => ({
      id: randomUUID(),
      brand: String(item.brand ?? ''),
      text: String(item.text ?? ''),
      respondent: String(item.respondent ?? ''),
      sentiment: this.normalizeSentiment(item.sentiment),
      dimension: item.dimension ? String(item.dimension) : undefined,
      subDimension: item.subDimension ? String(item.subDimension) : undefined,
    }));
  }

  /**
   * Split text into overlapping chunks at natural paragraph/sentence boundaries.
   * Overlap ensures VOCs that span a boundary aren't missed.
   */
  private splitIntoChunks(text: string, maxChunkSize = 8000, overlap = 500): string[] {
    if (text.length <= maxChunkSize) return [text];

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      let end = Math.min(start + maxChunkSize, text.length);

      // Try to break at a paragraph boundary (double newline) near the end of the chunk
      if (end < text.length) {
        const breakAt = text.lastIndexOf('\n\n', end);
        if (breakAt > start + maxChunkSize * 0.5) {
          end = breakAt + 2;
        } else {
          // Fall back to single newline
          const lineBreak = text.lastIndexOf('\n', end);
          if (lineBreak > start + maxChunkSize * 0.5) {
            end = lineBreak + 1;
          }
        }
      }

      chunks.push(text.slice(start, end));
      start = end - overlap; // overlap to avoid missing cross-boundary content
      if (start < 0) start = 0;
    }

    return chunks;
  }

  async extractVOCs(textContent: string): Promise<VOCItem[]> {
    this.logger.log(
      `Extracting VOCs from text (${textContent.length} chars)`,
    );

    const chunks = this.splitIntoChunks(textContent);
    this.logger.log(`Split into ${chunks.length} chunk(s) for VOC extraction`);

    const allItems: VOCItem[] = [];

    for (let i = 0; i < chunks.length; i++) {
      this.logger.log(`Processing chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);
      try {
        const items = await this.extractVOCsFromChunk(chunks[i], i, chunks.length);
        allItems.push(...items);
        this.logger.log(`Chunk ${i + 1}: extracted ${items.length} items`);
      } catch (err) {
        this.logger.error(`Chunk ${i + 1} extraction failed: ${err}`);
        // Continue with other chunks even if one fails
      }
    }

    // Deduplicate by exact text match (overlapping chunks may produce duplicates)
    const seen = new Set<string>();
    const deduped = allItems.filter((item) => {
      const key = `${item.brand}||${item.text.trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    this.logger.log(`Extracted ${deduped.length} VOC items (${allItems.length} before dedup)`);
    return deduped;
  }

  async generateBrandReport(
    vocItems: VOCItem[],
  ): Promise<Record<string, { coreFindings: string[]; typicalAttitudes: string[]; strengths: string[]; painPoints: string[] }>> {
    this.logger.log(`Generating brand report from ${vocItems.length} VOC items`);

    const prompt = `你是一位用户研究专家。请根据以下VOC（用户之声）数据，按品牌进行横向对比分析，为每个品牌生成结构化总结。

输出格式为JSON对象，key为品牌名称，value为包含以下字段的对象：
- coreFindings: 核心发现（3-5条）
- typicalAttitudes: 用户典型态度（2-3条代表性引用或总结）
- strengths: 优势亮点（2-4条）
- painPoints: 痛点槽点（2-4条）

如果某个品牌的数据不足，可以标注"数据不足，无法充分分析"。
只输出JSON，不要其他文字。`;

    const vocText = vocItems.map(v => `[${v.brand}][${v.sentiment}][${v.dimension || ''}] ${v.respondent}: ${v.text}`).join('\n');

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.aiModel,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: vocText },
        ],
        max_tokens: 8192,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120_000,
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim() ?? '{}';
    const parsed = this.parseJsonObjectFromResponse(raw);
    this.logger.log(`Brand report generated for ${Object.keys(parsed).length} brands`);
    return parsed;
  }

  async generateProjectSummary(
    vocItems: VOCItem[],
    projectName: string,
  ): Promise<{ coreFindings: string[]; actionItems: string[]; methodology: string }> {
    this.logger.log(`Generating project summary for "${projectName}"`);

    const prompt = `你是一位用户研究专家。请根据以下VOC数据，生成该研究项目的总结报告。

输出格式为JSON对象，包含以下字段：
- coreFindings: 核心发现，值为字符串数组，每条是一句话的字符串（5-8条）。注意：数组元素必须是字符串，不能是对象。示例：["发现1", "发现2"]
- actionItems: 行动建议，值为字符串数组，每条是一句话的字符串（3-5条）。注意：数组元素必须是字符串。示例：["建议1", "建议2"]
- methodology: 研究方法简述，值为一段话的字符串

只输出JSON，不要其他文字。`;

    const vocText = vocItems.map(v => `[${v.brand}][${v.sentiment}][${v.dimension || ''}] ${v.respondent}: ${v.text}`).join('\n');

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.aiModel,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: `项目名称：${projectName}\n\nVOC数据：\n${vocText}` },
        ],
        max_tokens: 4096,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120_000,
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim() ?? '{}';
    const parsed = this.parseJsonObjectFromResponse(raw);

    // Normalize: each item must be a plain string (AI sometimes returns objects)
    const toStringArray = (arr: unknown): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr.map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
          // Handle {finding, rank, sentiment}, {text}, {content}, {description} etc.
          const obj = item as Record<string, unknown>;
          return String(obj.finding ?? obj.text ?? obj.content ?? obj.description ?? obj.item ?? JSON.stringify(item));
        }
        return String(item);
      }).filter(Boolean);
    };

    return {
      coreFindings: toStringArray(parsed.coreFindings),
      actionItems: toStringArray(parsed.actionItems),
      methodology: typeof parsed.methodology === 'string' ? parsed.methodology : '深度访谈 + 问卷调研',
    };
  }

  async parseDocument(textContent: string): Promise<string> {
    this.logger.log(
      `Parsing document text (${textContent.length} chars)`,
    );

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: this.aiModel,
        messages: [
          {
            role: 'system',
            content:
              '你是一位文档处理专家。请清理和整理以下文档内容，去除无关格式和噪音，保留所有有意义的文本内容。输出整理后的纯文本。',
          },
          { role: 'user', content: textContent },
        ],
        max_tokens: 16384,
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120_000,
      },
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim() ?? '';
    this.logger.log(`Document parsed: ${text.length} chars`);
    return text;
  }

  private parseJsonFromResponse(raw: string): Record<string, unknown>[] {
    let jsonStr = raw;

    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1];
    }

    jsonStr = jsonStr.trim();

    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (err) {
      this.logger.error(`Failed to parse AI response as JSON: ${err}`);
      this.logger.debug(`Raw response: ${raw.slice(0, 500)}`);
      return [];
    }
  }

  private parseJsonObjectFromResponse(raw: string): Record<string, any> {
    let jsonStr = raw;

    const fenceMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1];
    }

    jsonStr = jsonStr.trim();

    try {
      return JSON.parse(jsonStr);
    } catch (err) {
      this.logger.error(`Failed to parse AI response as JSON object: ${err}`);
      this.logger.debug(`Raw response: ${raw.slice(0, 500)}`);
      return {};
    }
  }

  private normalizeSentiment(
    value: unknown,
  ): 'positive' | 'neutral' | 'negative' {
    const s = String(value ?? '').toLowerCase();
    if (s === 'positive' || s === '正面') return 'positive';
    if (s === 'negative' || s === '负面') return 'negative';
    return 'neutral';
  }
}
