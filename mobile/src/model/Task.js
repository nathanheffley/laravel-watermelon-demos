import {Model} from '@nozbe/watermelondb';
import {field, text, writer} from '@nozbe/watermelondb/decorators';

export default class Task extends Model {
  static table = 'tasks';

  @text('name') name
  @field('is_completed') isCompleted

  @writer async markAsDone() {
    await this.update(task => {
      task.isCompleted = true;
    });
  }

  @writer async markAsIncomplete() {
    await this.update(task => {
      task.isCompleted = false;
    });
  }
}
