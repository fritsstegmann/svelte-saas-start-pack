import { createReposity } from ".";
import { db } from "../db";
import { usersTable } from "../schema";

const userRepository = createReposity(db, usersTable, {
    async afterInsert() {},
    async afterDelete() {},
    async afterUpdate() {},
});

export default userRepository;
