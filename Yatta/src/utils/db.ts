// db.ts
import Dexie, { type EntityTable } from 'dexie';
import { nanoid } from 'nanoid';

interface Note {
  id: string;             // 主键，建议使用 nanoid 等生成
  createdAt: number;      // 时间戳
  updatedAt: number;      // 更新时间（用于排序）
  tags?: string[];      // 关联标签ID（可多个）
  pageInfo: {
    url: string;
    title: string;
  };
  content: string;
}

interface Tag {
  id: string;            // 标签唯一 ID（如 nanoid）
  name: string;          // 标签名称，例如 "idea"、"glimmer"
  createdAt: number;     // 标签创建时间
  updatedAt: number;     // 标签更新时间
}

const db = new Dexie('NotesDatabase') as Dexie & {
  notes: EntityTable<Note, 'id'>;
  tags: EntityTable<Tag, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  notes: 'id, createdAt, updatedAt, tags, pageInfo, content',
  tags: 'id, name, createdAt, updatedAt'
});

// 👇 只在首次创建数据库时触发
db.on('populate', async () => {
  // 添加默认标签
  await db.tags.bulkAdd([
    { id: nanoid(), name: 'glimmer', createdAt: Date.now(), updatedAt: Date.now() },
    { id: nanoid(), name: 'justbecause', createdAt: Date.now(), updatedAt: Date.now() },
    { id: nanoid(), name: 'huh?', createdAt: Date.now(), updatedAt: Date.now() },
  ]);
});


export type { Note, Tag };
export { db };
