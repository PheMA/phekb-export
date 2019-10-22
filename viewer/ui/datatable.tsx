import React from "react";
import {
  Column,
  ColumnHeaderCell,
  EditableCell,
  EditableName,
  Table,
  RenderMode
} from "@blueprintjs/table";

import * as renderers from "./renderers";

class DataTable extends React.PureComponent {
  protected phenotypeColumns: Array<JSX.Element>;

  protected getColumn(columnIndex: number) {
    const offset = this.phenotypeColumns.length;

    return this.props.userColumnManager.getColumn(columnIndex, offset);
  }

  public columnHeaderRenderer = (columnIndex: number) => {
    const column = this.getColumn(columnIndex);
    const offset = this.phenotypeColumns.length;

    const nameRenderer = (name: string) => {
      return (
        <EditableName
          index={columnIndex - offset}
          name={name == null ? "" : name}
          onChange={this.props.userColumnManager.onNameChange}
          onCancel={this.props.userColumnManager.onNameCancel}
          onConfirm={this.props.userColumnManager.onNameConfirm}
        />
      );
    };
    return (
      <ColumnHeaderCell
        name={column.name}
        nameRenderer={nameRenderer.bind(this)}
      />
    );
  };

  protected cellRenderer(rowIndex: number, columnIndex: number) {
    const offset = this.phenotypeColumns.length;
    const value = this.props.userColumnManager.getCell(
      columnIndex - offset,
      rowIndex
    );

    return (
      <EditableCell
        columnIndex={columnIndex - offset}
        rowIndex={rowIndex}
        value={value == null ? "" : value}
        onChange={this.props.userColumnManager.onCellChange}
        onCancel={this.props.userColumnManager.onCellCancel}
        onConfirm={this.props.userColumnManager.onCellConfirm}
      />
    );
  }

  protected renderUserColumns(userColumns) {
    return userColumns.map((column, index) => {
      return (
        <Column
          key={`${index}-${column.name}`}
          cellRenderer={this.cellRenderer.bind(this)}
          columnHeaderCellRenderer={this.columnHeaderRenderer.bind(this)}
        />
      );
    });
  }

  protected createCol(name, cellRenderer) {
    return <Column name={name} key={name} cellRenderer={cellRenderer} />;
  }

  protected buildPhenotypeColumns = phenotypes => {
    this.phenotypeColumns = [
      this.createCol("ID", renderers.id(phenotypes, "id")),
      this.createCol("Name", renderers.string(phenotypes, "name")),
      this.createCol("Summary", renderers.summary(phenotypes, "summary")),
      this.createCol("Status", renderers.string(phenotypes, "status")),
      this.createCol("Created", renderers.string(phenotypes, "date_created")),
      this.createCol(
        "Institution",
        renderers.string(phenotypes, "institution")
      ),
      this.createCol(
        "Collaboration",
        renderers.boolean(phenotypes, "collaboration_list")
      ),
      this.createCol("Authors", renderers.stringArray(phenotypes, "authors")),
      this.createCol("Type", renderers.stringArray(phenotypes, "type")),
      this.createCol(
        "Data Modalities",
        renderers.stringArray(phenotypes, "data_modalities")
      ),
      this.createCol(
        "Data Models",
        renderers.stringArray(phenotypes, "data_models")
      ),
      this.createCol("Race", renderers.stringArray(phenotypes, "race")),
      this.createCol("Gender", renderers.stringArray(phenotypes, "gender"))
    ];
  };

  public render() {
    const { phenotypes, userColumnManager } = this.props;

    this.buildPhenotypeColumns(phenotypes);

    return (
      <Table
        renderMode={RenderMode.BATCH_ON_UPDATE}
        defaultRowHeight={80}
        enableRowHeader={true}
        numRows={phenotypes.length}
      >
        {this.phenotypeColumns}
        {this.renderUserColumns(userColumnManager.getColumns())}
      </Table>
    );
  }
}

export default DataTable;
