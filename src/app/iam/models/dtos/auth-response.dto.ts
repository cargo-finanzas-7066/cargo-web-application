import { UserDto } from './user.dto';

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}
