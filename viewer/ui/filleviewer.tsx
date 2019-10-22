import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarHeading,
  NavbarGroup,
  NavbarDivider,
  Alignment,
  Button,
  Classes,
  NonIdealState
} from "@blueprintjs/core";

const API_ROOT = "http://localhost:3000";

const getUrl = (relativeUrl, phenotypeId) =>
  `${API_ROOT}/phenotype/${phenotypeId}${relativeUrl}`;

const PDFViewer = props => {
  return <iframe className="pkb__fileviewer__pdf" src={props.url} />;
};

const TextViewer = props => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(props.url)
      .then(res => res.text())
      .then(text => setText(text));
  });

  return (
    <div className="pkb__fileviewer__text__wrapper">
      <pre className="pkb__fileviewer__text__content bp3-running-text bp3-text-large bp3-code-block">
        {text}
      </pre>
    </div>
  );
};

const renderFileViewer = fileObject => {
  if (fileObject.type === "application/pdf") {
    return <PDFViewer url={getUrl(fileObject.url, fileObject.phenotype.id)} />;
  } else if (fileObject.type === "text/plain") {
    return <TextViewer url={getUrl(fileObject.url, fileObject.phenotype.id)} />;
  } else {
    return (
      <NonIdealState
        icon="error"
        title="Unsuppored File Type"
        description="Cannot render this type of file right now."
      />
    );
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
      {renderFileViewer(fileObject)}
    </div>
  );
};

export default FileViewer;
