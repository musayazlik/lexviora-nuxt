import { createAuthClient } from 'better-auth/vue';
import { adminClient } from 'better-auth/client/plugins';
import { ac, roles } from '#shared/permissions';

export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
});
export type SessionUser = typeof authClient.$Infer.Session.user;

/**
 * Reactive session for components. The first call in a setup context is
 * hydrated from the SSR request, later calls reuse the same reactive state.
 */
export function useAuthSession() {
  const session = authClient.useSession();
  const serverUser = useState<SessionUser | null>('staff-user', () => null);
  return {
    user: computed(() => session.value?.data?.user ?? serverUser.value),
    isPending: computed(() => session.value?.isPending ?? true),
  };
}
