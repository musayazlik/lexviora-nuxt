import { createAuthClient } from 'better-auth/vue';
import { adminClient } from 'better-auth/client/plugins';
import { ac, roles } from '#shared/permissions';

export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
});

/**
 * Reactive session for components. The first call in a setup context is
 * hydrated from the SSR request, later calls reuse the same reactive state.
 */
export function useAuthSession() {
  const session = authClient.useSession();
  return {
    user: computed(() => session.value?.data?.user ?? null),
    isPending: computed(() => session.value?.isPending ?? true),
  };
}
