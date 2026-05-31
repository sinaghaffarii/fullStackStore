import OTP from '../../modules/user/models/otp.model';
import RefreshToken from '../../modules/user/models/refresh-token.model';
import TokenBlacklist from '../../modules/user/models/token-blacklist.model';

interface CleanupResult {
  otps: number;
  refreshTokens: number;
  blacklistedTokens: number;
  total: number;
}

export class CleanupService {
  static async cleanupAll(): Promise<CleanupResult> {
    const [otps, refreshTokens, blacklistedTokens] = await Promise.all([
      OTP.cleanupExpired(),
      RefreshToken.cleanupExpired(),
      TokenBlacklist.cleanupExpired(),
    ]);

    const total = otps + refreshTokens + blacklistedTokens;

    return { otps, refreshTokens, blacklistedTokens, total };
  }

  static async cleanupOtps(): Promise<number> {
    return OTP.cleanupExpired();
  }

  static async cleanupTokens(): Promise<{
    refreshTokens: number;
    blacklisted: number;
  }> {
    const [refreshTokens, blacklisted] = await Promise.all([
      RefreshToken.cleanupExpired(),
      TokenBlacklist.cleanupExpired(),
    ]);
    return { refreshTokens, blacklisted };
  }

  static startAutoCleanup(intervalMinutes: number = 30): NodeJS.Timeout {
    console.log(`🧹 Auto cleanup started (every ${intervalMinutes} minutes)`);

    CleanupService.cleanupAll()
      .then((result) => {
        if (result.total > 0) {
          console.log('🧹 Initial cleanup:', result);
        }
      })
      .catch((err) => console.error('❌ Initial cleanup error:', err));

    return setInterval(
      async () => {
        try {
          const result = await CleanupService.cleanupAll();

          if (result.total > 0) {
            console.log(`🧹 Cleanup completed:`, {
              otps: result.otps,
              refreshTokens: result.refreshTokens,
              blacklisted: result.blacklistedTokens,
            });
          }
        } catch (error) {
          console.error('❌ Cleanup error:', error);
        }
      },
      intervalMinutes * 60 * 1000,
    );
  }

  static stopAutoCleanup(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
    console.log('🛑 Auto cleanup stopped');
  }
}
