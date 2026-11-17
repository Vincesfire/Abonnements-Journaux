export const onRequest = async (context) => {
  const { request, env } = context;
  const auth = request.headers.get('Authorization');
  
  // Vos identifiants définis dans les variables d'environnement Cloudflare
  const [user, pass] = [env.BASIC_USER, env.BASIC_PASS]; 

  if (!auth || !isValid(auth, user, pass)) {
    return new Response('Accès restreint', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Espace Privé"' },
    });
  }
  return await context.next();
};

const isValid = (auth, user, pass) => {
  try {
    const [scheme, encoded] = auth.split(' ');
    if (scheme !== 'Basic') return false;
    const decoded = atob(encoded).split(':');
    return decoded[0] === user && decoded[1] === pass;
  } catch {
    return false;
  }
};
