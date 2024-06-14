import {Configuration} from '../../gen/msw-api-ts';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const authConfiguration = (token: string | null, callback: (config: Configuration) => void) => {
  let config;
  if (token) {
    config = new Configuration({
      baseOptions: {
        headers: {Authorization: 'Bearer ' + token},
      },
    });
  } else {
    config = new Configuration({});
  }

  callback(config);
}
