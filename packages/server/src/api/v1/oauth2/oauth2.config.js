export default {
  grants: ['authorization_code', 'refresh_token'],
  accessTokenLifetime: 60 * 60 * 2, // 2 hours
  refreshTokenLifetime: 60 * 60 * 24 * 365 * 1000, // 1000 Years
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
  alwaysIssueNewRefreshToken: false
};
