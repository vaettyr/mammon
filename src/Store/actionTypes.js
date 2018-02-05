//dialog actions
export const SHOW_DIALOG = "dialog/SHOW";
export const HIDE_DIALOG = "dialog/HIDE";
export const UPDATE_DIALOG = "dialog/UPDATE";
//login actions (refactor?)
export const GET_CIPHER_KEY = "login/GET_CIPHER_KEY";
export const GET_CREDENTIALS = "login/GET_CREDENTIALS";
//cache actions
export const CACHE_PUSH = "cache/PUSH";
export const CACHE_POP = "cache/POP";
export const CACHE_CLEAR = "cache/CLEAR";
//menu actions
export const SHOW_MENU = "menu/SHOW";
export const HIDE_MENU = "menu/HIDE";
//data service actions
export const GET_DATA_TIME_START = "data/LAST_UPDATE_START";
export const GET_DATA_TIME_END = "data/LAST_UPDATE_END";
export const GET_DATA_TIME_ERROR = "data/LAST_UPDATE_ERROR";
export const GET_DATA_START = "data/GET_START";
export const GET_DATA_END = "data/GET_END";
export const GET_DATA_ERROR = "data/GET_ERROR";
export const CREATE_DATA_START = "data/CREATE_START";
export const CREATE_DATA_END = "data/CREATE_END";
export const CREATE_DATA_ERROR = "data/CREATE_ERROR";
export const SAVE_DATA_START = "data/SAVE_START";
export const SAVE_DATA_END = "data/SAVE_END";
export const SAVE_DATA_ERROR = "data/SAVE_ERROR";
export const DELETE_DATA_START = "data/DELETE_START";
export const DELETE_DATA_END = "data/DELETE_END";
export const DELETE_DATA_ERROR = "data/DELETE_ERROR";
export const CLEAN_DATA = "data/CLEAN";
export const AUGMENT_DATA = "data/AUGMENT";
//data source
export const GET_DATA_SOURCE_START = "datasource/READ_START";
export const GET_DATA_SOURCE_END = 'datasource/READ_END';
export const GET_DATA_SOURCE_ERROR = 'datasource/READ_ERROR';
//form actions
export const FORM_SET_VALUES = 'form/SET_VALUES';
export const FORM_SET_VALUE = 'form/SET_VALUE';
export const FORM_CLEAR_VALUES = 'form/CLEAR_VALUES';
export const FORM_LIST_ADD = 'form/ADD_LIST';
export const FORM_LIST_INSERT = 'form/INSERT_LIST';
export const FORM_LIST_REMOVE = 'form/REMOVE_LIST';
export const FORM_LIST_SORT = "form/SORT_LIST";
//form validation
export const VALIDATOR_SET_ERROR = 'validator/SET_ERROR';
export const VALIDATOR_CLEAR_ERROR = 'validator/CLEAR_ERROR';
//conditions
export const CONDITIONS_SET_ITEM = "conditions/SET_ITEM";
export const CONDITIONS_CLEAR_ITEM = 'conditions/CLEAR_ITEM';
//limits
export const LIMITS_SET_ITEM = "limits/SET_ITEM";
export const LIMITS_CLEAR_ITEM = 'limits/CLEAR_ITEM';
//nav functions
//generic page functions
export const PAGE_UPDATE = "page/UPDATE";
//options filters
export const SET_OPTION_FILTER = "options/SET_ACTIVE";
export const OPTION_NEW_TYPE = "options/NEWTYPE";
export const OPTION_EDIT_TYPE = "options/EDITTYPE";
export const OPTION_CLOSE_TYPE = "options/CLOSETYPE";
export const OPTION_EDIT_ENTRY = "options/EDITENTRY";
export const OPTION_CLOSE_ENTRY = "options/CLOSEENTRY";