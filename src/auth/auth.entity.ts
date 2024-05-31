export class UserAuthBase {
    email: string;
    password: string;
}

export class UserAuthCreate extends UserAuthBase {
    id: string;
}

export class UserAuthEntity extends UserAuthCreate {
    createdAt: Date;
    updatedAt: string;
}

export class UserAuthPayload {
    id: string;
    email: string;
}