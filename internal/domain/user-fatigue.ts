export interface UserFatigue {
  id: string;
  userId: string;
  fatigueLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserFatigueInput {
  userId: string;
  fatigueLevel: number;
}

export interface UpdateUserFatigueInput {
  fatigueLevel?: number;
}

export interface UserFatigueRepository {
  findAll(): Promise<UserFatigue[]>;
  findById(id: string): Promise<UserFatigue | null>;
  findByUserId(userId: string): Promise<UserFatigue[]>;
  create(input: CreateUserFatigueInput): Promise<UserFatigue>;
  update(id: string, input: UpdateUserFatigueInput): Promise<UserFatigue | null>;
  delete(id: string): Promise<boolean>;
}
