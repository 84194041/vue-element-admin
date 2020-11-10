var config = {
  authority: "http://192.168.0.101:8010",
  client_id: 'js',
  redirect_uri: "http://192.168.0.101:9527/#/signin-callback-oidc",
  post_logout_redirect_uri: "http://192.168.0.101:9527",
  response_type: 'code',
  scope: "openid profile usercenterapi.read"
}

export default config
