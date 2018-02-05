import { combineReducers } from 'redux';
import { dialog } from './reducers/dialog';
import { data } from './reducers/data';
import { options } from './reducers/options';
import { menu } from './reducers/menu';
import { form } from './reducers/form';
import { cache } from './reducers/cache';
import { page } from './reducers/page';
import { validator } from './reducers/validator';
import { conditions } from './reducers/conditions';
import { datasource } from './reducers/datasource';

export default combineReducers({dialog, data, options, menu, form, cache, page, validator, conditions, datasource});