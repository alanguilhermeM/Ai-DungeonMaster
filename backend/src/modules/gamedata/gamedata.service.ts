import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class GameDataService implements OnModuleInit {
  private basePath: string = path.resolve(__dirname, '../../../../gameData');
  private data: any = {
    npcs: {},
    locations: {},
    clues: {},
    events: {},
    scenes: {},
    quests: {},
    world: {},
    gameStateTemplate: {},
  };

  async onModuleInit() {
    await this.loadAll();
  }

  async loadDirectory(folderName: string): Promise<Record<string, any>> {
    const folderPath = path.join(this.basePath, folderName);

    const dataJSON: Record<string, any> = {};
    const contents = await fs.readdir(folderPath);

    for (const content of contents) {
      const fullPath = path.join(folderPath, content);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        const result = await this.loadDirectory(path.join(folderName, content));
      
        Object.assign(dataJSON, result);
      } else if (content.endsWith('.json')) {
        try {
          const data = await fs.readFile(fullPath, 'utf8');
          const json = JSON.parse(data);

          dataJSON[json.id] = json;
        } catch (error) {
          console.error('Erros ao ler ou parsear JSON:', fullPath, error);
        }
      }
    }
    return dataJSON;
  }

  async loadFile(filePath: string): Promise<Object> {
    const fullPath = path.resolve(__dirname, '../../../../gameData', filePath);

    const content = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(content);
  }

  async loadAll(): Promise<void> {
    this.data.npcs = await this.loadDirectory('npcs');
    this.data.locations = await this.loadDirectory('locations');
    this.data.clues = await this.loadDirectory('clues');
    this.data.events = await this.loadDirectory('events');
    this.data.scenes = await this.loadDirectory('scenes');
    this.data.quests = await this.loadDirectory('quests');
    this.data.world = await this.loadDirectory('world');
    this.data.gameStateTemplate = await this.loadFile(
      'gameState.template.json',
    );
  }

  getNPC(id: string) {
    return this.data.npcs[id];
  }

  getLocation(id: string) {
    return this.data.locations[id];
  }

  getGameStateTemplate() {
    return this.data.gameStateTemplate;
  }
}
