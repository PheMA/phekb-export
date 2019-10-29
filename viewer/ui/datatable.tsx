import React, { useState, useEffect } from "react";
import {
  Column,
  ColumnHeaderCell,
  EditableCell,
  EditableName,
  Table,
  RenderMode
} from "@blueprintjs/table";
import { Intent, Menu, MenuItem, MenuDivider, Alert } from "@blueprintjs/core";

import * as renderers from "./renderers";

const UserColumnMenu = props => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    deleteColumn,
    insertColumn,
    moveColumn,
    index,
    offset,
    count
  } = props;

  return (
    <React.Fragment>
      <Menu>
        <MenuItem
          onClick={() => {
            insertColumn(index - offset);
          }}
          icon="add-column-left"
          text="Insert Left"
        ></MenuItem>
        <MenuItem
          onClick={() => {
            insertColumn(index - offset + 1);
          }}
          icon="add-column-right"
          text="Insert Right"
        ></MenuItem>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            moveColumn(index - offset, -1);
          }}
          disabled={index - offset === 0}
          icon="arrow-left"
          text="Move Left"
        ></MenuItem>
        <MenuItem
          disabled={index - offset + 1 === count}
          onClick={() => {
            moveColumn(index - offset, +1);
          }}
          icon="arrow-right"
          text="Move Right"
        ></MenuItem>
        <MenuDivider />
        <MenuItem
          icon="trash"
          text="Delete"
          intent={Intent.DANGER}
          onClick={() => setIsOpen(true)}
          shouldDismissPopover={false}
        ></MenuItem>
      </Menu>
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Delete"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
        onConfirm={() => {
          setIsOpen(false);
          deleteColumn(index - offset);
        }}
      >
        <p>
          Are you sure you want to delete this column? You will not be able to
          restore it later.
        </p>
      </Alert>
    </React.Fragment>
  );
};

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
        menuRenderer={index => (
          <UserColumnMenu
            offset={offset}
            count={this.props.userColumns.length}
            insertColumn={this.props.insertColumn}
            deleteColumn={this.props.deleteColumn}
            moveColumn={this.props.moveColumn}
            index={index}
          />
        )}
      />
    );
  };

  protected cellRenderer(rowIndex: number, columnIndex: number) {
    const offset = this.phenotypeColumns.length;
    const value = this.props.getCell(columnIndex - offset, rowIndex);

    const editableTextProps = {
      multiline: true,
      minLines: 4,
      confirmOnEnterKey: true
    };

    return (
      <EditableCell
        className="pkb__editablecell"
        style={{ whiteSpace: "pre" }}
        intent={Intent.PRIMARY}
        editableTextProps={editableTextProps}
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
      // this.createCol("ID", renderers.id(phenotypes, "id")), // 0
      this.createCol("Name", renderers.name(phenotypes, "name")), // 1
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

  protected applyFilter(phenotypes, filter) {
    return phenotypes.filter(phenotype => {
      let hasMatch = false;

      Object.values(phenotype).forEach(value => {
        if (!!String(value).match(new RegExp(filter, "ig"))) {
          hasMatch = true;
        }
      });

      return hasMatch;
    });
  }

  public render() {
    const { phenotypes, userColumns, filter } = this.props;

    const filtered = filter ? this.applyFilter(phenotypes, filter) : phenotypes;

    this.buildPhenotypeColumns(filtered);

    return (
      <div className="pkb__datatable">
        <Table
          numFrozenColumns={1}
          // renderMode={RenderMode.NONE}
          defaultRowHeight={80}
          enableRowHeader={true}
          numRows={filtered.length}
        >
          {this.phenotypeColumns}
          {this.renderUserColumns(userColumns)}
        </Table>
      </div>
    );
  }
}

export default DataTable;
