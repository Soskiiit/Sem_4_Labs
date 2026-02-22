import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface FileAccessor {
  filePath: string;
}

@Injectable()
export class FileService<I> {
  private readonly filePath = path.resolve(__dirname);

  constructor(filePath?: string) {
    if (filePath) {
      this.filePath = path.resolve(__dirname, filePath);
    }
  }

  public read<T extends I>(): T {
    // If file doesn't exist, create it with empty array
    if (!fs.existsSync(this.filePath)) {
      this.write([] as unknown as T);
      return [] as unknown as T
    }

    const data = fs.readFileSync(this.filePath, 'utf8');

    return JSON.parse(data) as T;
  }

  public add<T>(newData: T): void {
    const data = this.read();

    if (Array.isArray(data)) {
      data.push(newData);
    }

    this.write(data);
  }

  public write<T extends I>(data: T): void {
    // Ensure directory exists
    const dirname = path.dirname(this.filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
