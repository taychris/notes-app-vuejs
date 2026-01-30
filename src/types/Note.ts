export enum Category {
  PERSONAL = 'Personal',
  WORK = 'Work',
  IDEAS = 'Ideas',
  TODO = 'Todo',
  OTHER = 'Other'
}

export interface Note {
  id: string
  title: string
  description: string
  category: Category
  createdAt: string
  updatedAt: string
}

export interface CreateNoteDto {
  title: string
  description: string
  category: Category
}

export interface UpdateNoteDto {
  id: string
  title: string
  description: string
  category: Category
}
