import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const { user, url } = request;

        // If there is no user, fall back to default behavior (URL)
        if (!user) {
            return super.trackBy(context);
        }

        // Include the user ID and role in the cache key to prevent data leaking between users
        // This ensures that different drivers (or admins/dispatchers) get their own cached version
        return `${url}_${user.role}_${user._id || user.userId}`;
    }
}
