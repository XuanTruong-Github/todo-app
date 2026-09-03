import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { TodoPriority, TodoStatus } from "src/common/enums/todo.enum";

@Schema({
  collection: 'todos',
  timestamps: true
})
export class Todo {
  @Prop({ type: String, required: true, trim: true, maxLength: 200 })
  title: string;

  @Prop({ type: String, trim: true, default: '' })
  description?: string;

  @Prop({ type: String, enum: TodoStatus, default: TodoStatus.TODO })
  status?: TodoStatus;

  @Prop({ type: String, enum: TodoPriority, default: TodoPriority.LOW })
  priority?: TodoPriority;

  @Prop({ type: Date, default: null, index: true })
  dueDate?: Date;

  @Prop({ type: [String], default: [], lowercase: true })
  tags?: string[];

  @Prop({ type: Date, default: null })
  completedAt?: Date
}

export type TodoDocument = HydratedDocument<Todo>;
export const TodoSchema = SchemaFactory.createForClass(Todo);