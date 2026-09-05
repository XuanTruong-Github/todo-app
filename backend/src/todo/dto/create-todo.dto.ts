import {
  IsString,
  MaxLength,
  IsOptional,
  MinLength,
  IsDate,
  IsEnum,
  IsArray,
} from 'class-validator';
import { TodoPriority, TodoStatus } from 'src/todo/todo.enum';
import { Transform } from 'class-transformer';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsOptional()
  dueDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
