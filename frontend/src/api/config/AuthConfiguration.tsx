import {Configuration} from '../../gen/msw-api-ts';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export async function authConfiguration(token: string | null) {
    let config: Configuration;
    if (token) {
        config = new Configuration({
            baseOptions: {
                headers: {Authorization: 'Bearer ' + token},
            },
        });
    } else {
        config = new Configuration({});
    }

    return config;
}
