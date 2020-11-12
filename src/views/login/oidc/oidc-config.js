var config = {
  authority: 'http://localhost:8010',
  client_id: 'js',
  redirect_uri: 'http://localhost:9527/#/signin-callback-oidc',
  post_logout_redirect_uri: 'http://localhost:9527',
  response_type: 'code',
  scope: 'openid profile usercenterapi.read'
}

export default config
