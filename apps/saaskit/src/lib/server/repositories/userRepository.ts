import { createReposity } from '.';
import { db } from '../db';
import { usersTable } from '../schema';

const userRepository = createReposity(db, usersTable, {
    afterInsert(v) {},
    afterDelete(v) {},
    afterUpdate(v) {},
});

export default userRepository;
