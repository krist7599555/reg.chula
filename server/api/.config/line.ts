const frontend =
  process.env.NODE_ENV == "production" ? "https://hugsnan.ml" : "http://localhost:9000";
export const redirect_uri = `/api/auth/line/verify`;
export const static_redirect_uri = `${frontend}/api/auth/line/verify`;
export const client_id = "1642547393";
export const client_secret = "f0f14ef28d00504ef7992e378eb7506b";
