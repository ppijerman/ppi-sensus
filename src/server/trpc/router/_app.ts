import { router } from "../trpc";
import { internalRouter } from "./internalRouter";
import { userRouter } from "./userRouter";
import { authRouter } from "./authRouter";

export const appRouter = router({
  user: userRouter,
  internal: internalRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
