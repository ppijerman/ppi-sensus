import { updateUserById } from "./user/updateUserById";
import { getUserById } from "./user/getUserById";
import { updateUser } from "./user/updateUser";
import { router } from "../trpc";
import { getSession } from "./user/getSession";
import { getUser } from "./user/getUser";
import { getUsers } from "./user/getUsers";
import { updateUserLogin } from "./user/updateUserLogin";
import { getUserUpdateProfileStatus } from "./user/getUserUpdateProfileStatus";
import { updateUserUniEmail } from "./user/updateUserUniEmail";
import { getUserUniEmail } from "./user/getUserUniversityEmail";
import { getUserUniEmailAndId } from "./user/getUserUniversityEmailAndId";
import { updateUserUniEmailAndUni } from "./user/updateUserUniEmailAndUni";
import { updateConsent } from "./user/updateConsent";
import { deleteUserById } from "./user/deleteUserById";

export const userRouter = router({
  getSession,
  getUser,
  updateUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserLogin,
  getUserUpdateProfileStatus,
  updateUserUniEmail,
  getUserUniEmail,
  getUserUniEmailAndId,
  updateUserUniEmailAndUni,
  updateConsent,
  deleteUserById,
});
