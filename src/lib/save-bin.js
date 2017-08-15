import idb from 'idb-keyval';
import Haikunator from 'haikunator';
import { replace } from 'react-router-redux';
import { setError } from '../actions/session';
import { setId } from '../actions/bin';

const slugger = new Haikunator({
  defaults: {
    // class defaults
    tokenLength: 3,
    tokenChars: 'ABCDEF0123456789',
  },
});

const slug = () => slugger.haikunate();

export async function save({ bin }, dispatch) {
  const copy = { ...bin };
  delete copy.loading;
  delete copy.error;
  const id = bin.id || slug();

  // if (id.startsWith('gist/')) {
  //   const { gist } = await import('./exporter.js');
  //   return gist(bin);
  // }

  return idb
    .set(id, copy)
    .then(() => {
      dispatch(replace(`/local/${id}${window.location.search}`));
      dispatch(setId(id));
    })
    .catch(e => {
      console.log(e);
      dispatch(setError(e.message));
    });
}