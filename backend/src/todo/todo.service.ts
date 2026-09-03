import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './todo.schema';
import { Model } from 'mongoose';
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private readonly todoModel: Model<Todo>) { }
  async create(createTodoDto: CreateTodoDto) {
    return this.todoModel.create(createTodoDto)
  }

  async findAll(query: QueryTodoDto) {
    const skip = (query.page - 1) * query.limit
    return this.todoModel.find().skip(skip).limit(query.limit).exec()
  }

  async findOne(id: string) {
    return this.todoModel.findById(id).lean()
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    return this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true })
  }

  async remove(id: string) {
    return this.todoModel.findByIdAndDelete(id)
  }
}
