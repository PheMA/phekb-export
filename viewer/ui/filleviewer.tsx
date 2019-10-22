import React from "react";
import {
  Navbar,
  NavbarHeading,
  NavbarGroup,
  NavbarDivider,
  Alignment,
  Button,
  Classes
} from "@blueprintjs/core";

const API_ROOT = "http://localhost:3000";

const getUrl = (relativeUrl, phenotypeId) =>
  `${API_ROOT}/phenotype/${phenotypeId}${relativeUrl}`;

const PDFViewer = props => {
  return <iframe className="pkb__fileviewer__pdf" src={props.url} />;
};

const renderFileViewere = fileObject => {
  if (fileObject.type === "application/pdf") {
    return <PDFViewer url={getUrl(fileObject.url, fileObject.phenotype.id)} />;
  } else {
    return "Cannot render file";
  }
};

const FileViewer = props => {
  const { fileObject, setFileObject } = props;

  if (!fileObject.url) return <div className="pkb__fileviewer"></div>;

  return (
    <div className="pkb__fileviewer">
      <Navbar>
        <NavbarGroup>
          <NavbarHeading className="bp3-text-overflow-ellipsis">
            {fileObject.phenotype && fileObject.phenotype.name}
          </NavbarHeading>
          <NavbarDivider />
          <NavbarHeading>
            <span className="bp3-text-overflow-ellipsis">
              {fileObject.name}
            </span>
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Button
            onClick={() => setFileObject({})}
            className={Classes.MINIMAL}
            icon="cross"
          />
        </NavbarGroup>
      </Navbar>
      {renderFileViewere(fileObject)}
    </div>
  );
};

export default FileViewer;
