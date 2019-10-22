type UserValue = string;

interface Column {
  name: string;
  values: Array<UserValue>;
}

class UserColumnManager {
  storageKey: string;
  columns: Array<Column>;

  constructor(storageKey: string = "phekb-viewer") {
    this.storageKey = storageKey;

    this.load();

    // Initialize for the first time if we need to
    if (!this.columns) {
      this.columns = new Array();
      this.save();
    }
  }

  load() {
    const data = localStorage.getItem(this.storageKey);
    this.columns = JSON.parse(data);
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.columns));
  }

  getColumn(colIndex: number, offset: number = 0) {
    return this.columns[colIndex - offset];
  }

  getCell(columnIndex: number, rowIndex: number) {
    return this.columns[columnIndex].values[rowIndex];
  }

  getColumns() {
    return this.columns;
  }

  addEmptyColumn = () => {
    this.columns.push({ name: null, values: [] });
    this.save();
  };

  onNameChange = (value: string, columnIndex?: number) => {
    this.columns[columnIndex].name = value;
  };

  onNameCancel = (value: string, columnIndex?: number) => {
    this.load();
  };

  onNameConfirm = (value: string, columnIndex?: number) => {
    this.save();
  };

  onCellChange = (value: string, rowIndex?: number, columnIndex?: number) => {
    this.columns[columnIndex].values[rowIndex] = value;
  };

  onCellCancel = (value: string, rowIndex?: number, columnIndex?: number) => {
    this.load();
  };

  onCellConfirm = (value: string, rowIndex?: number, columnIndex?: number) => {
    this.save();
  };
}

export default UserColumnManager;
