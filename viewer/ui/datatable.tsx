import React, { useState, useEffect } from "react";
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

    return this.props.getColumn(columnIndex, offset);
  }

  public columnHeaderRenderer = (columnIndex: number) => {
    const column = this.getColumn(columnIndex);
    const offset = this.phenotypeColumns.length;

    const nameRenderer = (name: string) => {
      return (
        <EditableName
          index={columnIndex - offset}
          name={name == null ? "" : name}
          onChange={this.props.onNameChange}
          onCancel={this.props.onNameCancel}
          onConfirm={this.props.onNameConfirm}
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
    const value = this.props.getCell(columnIndex - offset, rowIndex);

    return (
      <EditableCell
        columnIndex={columnIndex - offset}
        rowIndex={rowIndex}
        value={value == null ? "" : value}
        onChange={this.props.onCellChange}
        onCancel={this.props.onCellCancel}
        onConfirm={this.props.onCellConfirm}
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
      this.createCol("ID", renderers.id(phenotypes, "id")), // 0
      this.createCol("Name", renderers.string(phenotypes, "name")), // 1
      this.createCol("Summary", renderers.summary(phenotypes, "summary")), // 2
      this.createCol(
        "Files",
        renderers.files(phenotypes, "files", this.props.setFileObject) // 3
      ),
      this.createCol("Status", renderers.string(phenotypes, "status")), // 4
      this.createCol("Created", renderers.string(phenotypes, "date_created")), // 5
      this.createCol(
        "Institution",
        renderers.stringArray(phenotypes, "institution") // 6
      ),
      this.createCol(
        "Collaboration",
        renderers.boolean(phenotypes, "collaboration_list") // 7
      ),
      this.createCol("Authors", renderers.stringArray(phenotypes, "authors")), // 8
      this.createCol("Type", renderers.stringArray(phenotypes, "type")), // 9
      this.createCol(
        "Data Modalities",
        renderers.stringArray(phenotypes, "data_modalities") // 10
      ),
      this.createCol(
        "Data Models",
        renderers.stringArray(phenotypes, "data_models") // 11
      ),
      this.createCol("Race", renderers.stringArray(phenotypes, "race")), // 12
      this.createCol("Gender", renderers.stringArray(phenotypes, "gender")) // 13
    ];
  };

  public render() {
    const { phenotypes, userColumns } = this.props;

    this.buildPhenotypeColumns(phenotypes);

    return (
      <div className="pkb__datatable">
        <Table
          renderMode={RenderMode.BATCH_ON_UPDATE}
          defaultRowHeight={80}
          enableRowHeader={true}
          numRows={phenotypes.length}
        >
          {this.phenotypeColumns}
          {this.renderUserColumns(userColumns)}
        </Table>
      </div>
    );
  }
}

export default DataTable;
