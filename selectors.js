const PAGE = {
  CRUMB: "#breadcrumb > span:nth-child(3) > a",
  CRUMBS: "#breadcrumb span",

  DATA_DICTIONARIES: "div.tabs.clearfix > ul > li:nth-child(2) > a"
};

const META = {
  ID:
    "article > div > div.grid-6 > div.field.field-name-field-phenotype-id.field-type-number-integer.field-label-inline.clearfix > div.field-items > div",
  NAME: "#page-title",
  STATUS:
    "article > div > div.grid-6 > div.field.field-name-field-p-status.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  COLLABORATION_LIST:
    "article > div > div.grid-6 > div.field.field-name-field-p-collab.field-type-list-boolean.field-label-hidden > div > div",
  TYPE:
    "article > div > div.grid-6 > div.field.field-name-field-pgx-type.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  AUTHORS:
    "article > div > div.grid-6 > div.field.field-name-field-author.field-type-text.field-label-inline.clearfix > div.field-items > div",
  CONTACT_AUTHOR:
    "article > div > div.grid-6 > div.field.field-name-field-contact-author.field-type-entityreference.field-label-above > div.field-items > div > a",
  DATA_MODALITIES:
    "article > div > div.grid-6 > div.field.field-name-field-class.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  CONTACT:
    "article > div > div.grid-6 > div.field.field-name-field-contact-author.field-type-entityreference.field-label-above > div.field-items > div > a",
  FILES:
    "article > div > div.grid-6 > div.field.field-name-field-files.field-type-file.field-label-above > div.field-items > div > span > a",
  INSTITUTION:
    "article > div > div.grid-6 > div.field.field-name-field-institution.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  DATE_CREATED:
    "article > div > div.grid-6 > div.field.field-name-field-created-at.field-type-datetime.field-label-above > div.field-items > div > span",
  NETWORK_ASSOCIATIONS:
    "article > div > div.grid-6 > div.field.field-name-field-network-associations.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  OWNER_GROUPS:
    "article > div > div.grid-6 > div.field.field-name-field-owner-pgroup.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  VIEW_GROUPS:
    "article > div > div.grid-6 > div.field.field-name-field-view-pgroup.field-type-taxonomy-term-reference.field-label-above > div.field-items > div.field-item > a",
  CITATION: "",
  AGE:
    "article > div > div.grid-6 > div.field.field-name-field-ages.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  RACE:
    "article > div > div.grid-6 > div.field.field-name-field-race.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  GENDER:
    "article > div > div.grid-6 > div.field.field-name-field-gender.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  ETHNICITY:
    "article > div > div.grid-6 > div.field.field-name-field-ethnicity.field-type-taxonomy-term-reference.field-label-above > div.field-items > div > a",
  SUMMARY:
    "div.field.field-name-body.field-type-text-with-summary.field-label-hidden"
};

const DATA_DICTIONARIES = {
  ALL: "form",
  ALL_FILE_LINKS: "div.file_link a"
};

module.exports = {
  PAGE,
  META,
  DATA_DICTIONARIES
};
