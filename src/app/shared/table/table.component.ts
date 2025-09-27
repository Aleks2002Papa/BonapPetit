import { Component, computed, input, signal } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  standalone: false
})
export class TableComponent {
  users = input<User[]>([
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'Viewer' },
    { id: 4, name: 'Dave', email: 'dave@example.com', role: 'Admin' },
    { id: 5, name: 'Eva', email: 'eva@example.com', role: 'Editor' },
  ]);

  searchText = signal('');
  sortColumn = signal<keyof User | ''>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  usersInputSignal = signal<User[]>(this.users() ?? []);

  readonly filteredUsers = computed(() => {
    let list = this.usersInputSignal();

    const search = this.searchText().toLowerCase();
    if (search) {
      list = list.filter((user: { name: string; email: string; role: string; }) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    }

    const column = this.sortColumn();
    const direction = this.sortDirection();
    if (column) {
      list = [...list].sort((a, b) => {
        const valA = a[column];
        const valB = b[column];
        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  });

  sortBy(column: keyof User) {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  viewUser(user: User) {
    alert(`View: ${user.name}`);
  }

  editUser(user: User) {
    alert(`Edit: ${user.name}`);
  }

  deleteUser(user: User) {
    if (confirm(`Delete ${user.name}?`)) {
      const current = this.usersInputSignal();
      const updated = current.filter((u: { id: number; }) => u.id !== user.id);
      this.usersInputSignal.set(updated); // Parent should pass a writable signal!
    }
  }

  addUser() {
  const newId = this.users.length ? Math.max(...this.usersInputSignal().map(u => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    name: 'New User ' + newId,
    email: `newuser${newId}@example.com`,
    role: 'Viewer',
  };

  this.usersInputSignal.set([...this.usersInputSignal(), newUser]);
}
}
